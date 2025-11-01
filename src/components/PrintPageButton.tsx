import { useApp } from "@/contexts/appContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PrintPageButton = {
  value: string;
};

export default function PrintPageButton({ value }: PrintPageButton) {
  const { empresa } = useApp();
  return (
    <Button
      className="rounded-sm text-md"
      onClick={async () => {
        const target = document.getElementById(
          `graph-content-${value}`
        ) as HTMLElement;
        if (!target) {
          toast.error("Erro no print da página");
          return;
        }
        const PAGE_PADDING_X = 10; // Padding X in mm
        const PAGE_PADDING_Y = 10; // Padding Y in mm
        const PAGE_WIDTH = 297; // A4 page width in mm (landscape)
        const PAGE_HEIGHT = 210; // A4 page height in mm (landscape)
        const canvas = await html2canvas(target);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        const imgWidth = PAGE_WIDTH - 2 * PAGE_PADDING_X;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const header = empresa.nome;
        const lineHeight = pdf.getLineHeight();
        pdf.text(header, PAGE_PADDING_X, PAGE_PADDING_Y + lineHeight / 2);
        pdf.addImage(
          imgData,
          "PNG",
          PAGE_PADDING_X,
          PAGE_PADDING_Y + lineHeight / 2 + PAGE_PADDING_Y / 2,
          imgWidth,
          imgHeight
        );
        pdf.save("geral.pdf");
      }}
    >
      <i className="pi pi-download mr-2"></i>
      Download
    </Button>
  );
}
