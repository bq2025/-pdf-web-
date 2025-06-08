import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Trash2 } from "lucide-react";

function App() {
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((imgData) =>
      setImages((prev) => [...prev, ...imgData])
    );
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    if (images.length === 0) return;

    const pdf = new jsPDF();
    images.forEach((img, i) => {
      if (i !== 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 10, 10, 190, 270);
    });

    pdf.save("photos.pdf");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">照片转 PDF 工具</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={generatePDF}
        disabled={images.length === 0}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        生成 PDF
      </button>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {images.map((img, i) => (
          <div key={i} className="relative border rounded overflow-hidden">
            <img src={img} alt={`preview-${i}`} className="w-full h-auto" />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;