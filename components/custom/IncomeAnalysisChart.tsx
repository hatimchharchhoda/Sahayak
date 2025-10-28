// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
import autoTable from "jspdf-autotable";
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
      doc.setTextColor(37, 99, 235); // Blue
      doc.text(`Income Analysis Report`, 14, 20);

      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39);
      doc.text(providerName, 14, 32);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 42);

      const monthlySummaryData = monthlyData.map((item) => [
        item.month,
        `₹${item.income.toLocaleString()}`,
        item.services.length,
      ]);

      autoTable(doc, {
        startY: 50,
        head: [["Month", "Total Income", "Number of Services"]],
        body: monthlySummaryData,
        headStyles: {
          fillColor: [37, 99, 235], // Blue
          fontSize: 12,
          fontStyle: "bold",
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let yPos = (doc as any).lastAutoTable.finalY + 20;

      // Detailed Breakdown
      monthlyData.forEach((monthData) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
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
          headStyles: { fillColor: [37, 99, 235], fontSize: 11 },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      doc.setTextColor(37, 99, 235);
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
        styles: { fontSize: 12, textColor: [55, 65, 81] },
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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
      `}</style>

      <Card className="w-full mt-8 shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-[#E5E7EB] bg-white">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-inter font-semibold text-[#111827]">
            Monthly Income Analysis
          </CardTitle>
          <p className="text-sm font-poppins text-[#374151]">
            Track your monthly revenue and service completion trends
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-inter font-semibold text-[#111827]">
                {providerName}
              </h3>
              <p className="text-sm font-poppins text-[#374151]">
                {monthlyData.length} months of data
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:scale-[1.02] text-white font-inter font-medium gap-2 px-4 py-2 rounded-lg transition-transform duration-300"
              onClick={generatePDF}
            >
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
          <div className="h-80 w-full rounded-lg p-4 bg-[#F8FAFC] border border-[#E5E7EB]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#374151", fontFamily: "Poppins" }}
                  axisLine={{ stroke: "#9CA3AF" }}
                />
                <YAxis
                  tick={{ fill: "#374151", fontFamily: "Poppins" }}
                  tickFormatter={(v) => `₹${v.toLocaleString()}`}
                  axisLine={{ stroke: "#9CA3AF" }}
                />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Income"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.5rem",
                    color: "#111827",
                    fontFamily: "Poppins",
                  }}
                />
                <Bar dataKey="income" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default IncomeAnalysisChart;