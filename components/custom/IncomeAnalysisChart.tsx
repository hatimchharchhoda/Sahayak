import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";

interface CompletedService {
  basePrice: number;
  date: string;
  Service: {
    name: string;
  };
}

interface IncomeChartProps {
  completedServices: CompletedService[];
  providerName?: string;
}

const IncomeAnalysisChart = ({
  completedServices,
  providerName = "Provider",
}: IncomeChartProps) => {
  const monthlyData = useMemo(() => {
    const monthlyIncome: {
      [key: string]: { total: number; services: CompletedService[] };
    } = {};

    completedServices?.forEach((service) => {
      const date = new Date(service.date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyIncome[monthYear]) {
        monthlyIncome[monthYear] = { total: 0, services: [] };
      }
      monthlyIncome[monthYear].total += service.basePrice;
      monthlyIncome[monthYear].services.push(service);
    });

    return Object.entries(monthlyIncome)
      .map(([month, data]) => ({
        month,
        income: data.total,
        services: data.services,
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split(" ");
        const [monthB, yearB] = b.month.split(" ");
        return (
          new Date(`${monthA} 1, ${yearA}`).getTime() -
          new Date(`${monthB} 1, ${yearB}`).getTime()
        );
      });
  }, [completedServices]);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Add title with enhanced styling
      doc.setFontSize(24);
      doc.setTextColor(22, 163, 74); // Green color for title
      doc.text(`Income Analysis Report`, 14, 20);

      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235); // Blue color for provider name
      doc.text(providerName, 14, 32);

      // Add date with subtle styling
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // Slate color for date
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 42);

      // Add monthly summary table with enhanced styling
      const monthlySummaryData = monthlyData.map((item) => [
        item.month,
        `₹${item.income.toLocaleString()}`,
        item.services.length,
      ]);

      doc.autoTable({
        startY: 50,
        head: [["Month", "Total Income", "Number of Services"]],
        body: monthlySummaryData,
        headStyles: {
          fillColor: [22, 163, 74], // Green header
          fontSize: 12,
          fontStyle: "bold",
        },
      });

      // Add detailed breakdown for each month
      let yPos = (doc as any).lastAutoTable.finalY + 20;

      monthlyData.forEach((monthData) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(22, 163, 74); // Green color for section headers
        doc.text(`Detailed Breakdown - ${monthData.month}`, 14, yPos);

        const detailedData = monthData.services.map((service) => [
          new Date(service.date).toLocaleDateString(),
          service.Service.name,
          `₹${service.basePrice.toLocaleString()}`,
        ]);

        doc.autoTable({
          startY: yPos + 10,
          head: [["Date", "Service", "Amount"]],
          body: detailedData,
          headStyles: {
            fillColor: [22, 163, 74],
            fontSize: 11,
          },
        });

        yPos = (doc as any).lastAutoTable.finalY + 20;
      });

      // Add summary section with enhanced styling
      const totalIncome = monthlyData.reduce(
        (sum, month) => sum + month.income,
        0
      );
      const totalServices = monthlyData.reduce(
        (sum, month) => sum + month.services.length,
        0
      );

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(22, 163, 74);
      doc.text("Summary", 14, yPos);

      doc.autoTable({
        startY: yPos + 10,
        body: [
          ["Total Income", `₹${totalIncome.toLocaleString()}`],
          ["Total Services Completed", totalServices.toString()],
          [
            "Average Income per Service",
            `₹${(totalIncome / totalServices).toLocaleString()}`,
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 12,
          textColor: [71, 85, 105],
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
      });

      doc.save(`income-analysis-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report");
    }
  };

  if (monthlyData.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-8 border-green-200">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Monthly Income Analysis
        </CardTitle>
        <p className="text-sm text-black">
          Track your monthly revenue and service completion trends
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-black">{providerName}</h3>
            <p className="text-sm text-black">
              {monthlyData.length} months of data
            </p>
          </div>
          <Button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
        <div className="h-80 w-full rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22c55e" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#166534" }}
                axisLine={{ stroke: "#22c55e" }}
              />
              <YAxis
                tick={{ fill: "#166534" }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                axisLine={{ stroke: "#22c55e" }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  "Income",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #dc2626",
                  borderRadius: "0.375rem",
                  color: "#dc2626",
                }}
              />
              <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeAnalysisChart;
