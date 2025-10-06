// @ts-nocheck
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
import autoTable from "jspdf-autotable"; // ✅ Correct import
import { toast } from "react-hot-toast";

interface CompletedService {
  basePrice: number;
  date: string;
  isPaid: boolean;
  Service: { name: string };
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

    completedServices
      ?.filter((service) => service.isPaid)
      .forEach((service) => {
        const date = new Date(service.date);
        const monthYear = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        if (!monthlyIncome[monthYear])
          monthlyIncome[monthYear] = { total: 0, services: [] };
        monthlyIncome[monthYear].total += service.basePrice;
        monthlyIncome[monthYear].services.push(service);
      });

    return Object.entries(monthlyIncome)
      .map(([month, data]) => ({
        month,
        income: data.total,
        services: data.services,
      }))
      .sort(
        (a, b) =>
          new Date(a.month + " 1").getTime() -
          new Date(b.month + " 1").getTime()
      );
  }, [completedServices]);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(24);
      doc.setTextColor(22, 163, 74);
      doc.text(`Income Analysis Report`, 14, 20);

      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text(providerName, 14, 32);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 42);

      const monthlySummaryData = monthlyData.map((item) => [
        item.month,
        `₹${item.income.toLocaleString()}`,
        item.services.length,
      ]);

      // ✅ Use autoTable(doc, options)
      autoTable(doc, {
        startY: 50,
        head: [["Month", "Total Income", "Number of Services"]],
        body: monthlySummaryData,
        headStyles: {
          fillColor: [22, 163, 74],
          fontSize: 12,
          fontStyle: "bold",
        },
      });

      let yPos = (doc as any).lastAutoTable.finalY + 20;

      // Detailed Breakdown
      monthlyData.forEach((monthData) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(14);
        doc.setTextColor(22, 163, 74);
        doc.text(`Detailed Breakdown - ${monthData.month}`, 14, yPos);

        const detailedData = monthData.services.map((service) => [
          new Date(service.date).toLocaleDateString(),
          service.Service.name,
          `₹${service.basePrice.toLocaleString()}`,
        ]);

        autoTable(doc, {
          startY: yPos + 10,
          head: [["Date", "Service", "Amount"]],
          body: detailedData,
          headStyles: { fillColor: [22, 163, 74], fontSize: 11 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 20;
      });

      // Summary Section
      const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
      const totalServices = monthlyData.reduce(
        (sum, m) => sum + m.services.length,
        0
      );
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(22, 163, 74);
      doc.text("Summary", 14, yPos);

      autoTable(doc, {
        startY: yPos + 10,
        body: [
          ["Total Income", `₹${totalIncome.toLocaleString()}`],
          ["Total Services Completed", totalServices.toString()],
          [
            "Average Income per Service",
            `₹${(totalServices > 0
              ? totalIncome / totalServices
              : 0
            ).toLocaleString()}`,
          ],
        ],
        theme: "grid",
        styles: { fontSize: 12, textColor: [71, 85, 105] },
        columnStyles: { 0: { fontStyle: "bold" } },
      });

      doc.save(
        `income-analysis-${new Date().toISOString().split("T")[0]}.pdf`
      );
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    }
  };

  if (monthlyData.length === 0) return null;

  return (
    <Card className="w-full mt-8 shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 border-green-200 bg-white/90">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-poppins font-semibold bg-gradient-to-r from-[#00C853] to-[#AEEA00] bg-clip-text text-transparent">
          Monthly Income Analysis
        </CardTitle>
        <p className="text-sm font-nunito text-[#212121]">
          Track your monthly revenue and service completion trends
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-poppins font-semibold text-[#212121]">
              {providerName}
            </h3>
            <p className="text-sm font-nunito text-[#616161]">
              {monthlyData.length} months of data
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-poppins font-bold uppercase gap-2 px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
            onClick={generatePDF}
          >
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </div>
        <div className="h-80 w-full rounded-lg p-4 bg-white shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#AEEA00" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#166534" }}
                axisLine={{ stroke: "#22c55e" }}
              />
              <YAxis
                tick={{ fill: "#166534" }}
                tickFormatter={(v) => `₹${v.toLocaleString()}`}
                axisLine={{ stroke: "#22c55e" }}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Income"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #22c55e",
                  borderRadius: "0.375rem",
                  color: "#166534",
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