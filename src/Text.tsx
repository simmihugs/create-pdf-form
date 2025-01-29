import React, { useState, ChangeEvent } from 'react';
import { PDFDocument, PDFName, PDFDict, PDFArray, rgb } from 'pdf-lib';

const PdfModifier: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPdfFile(event.target.files[0]);
        }
    };

    const modifyPdf = async () => {
        if (!pdfFile) {
            alert('Please upload a PDF file first.');
            return;
        }

        try {
            const fileReader = new FileReader();
            fileReader.onload = async function (this: FileReader) {
                if (!this.result || typeof this.result === 'string') {
                    throw new Error('Failed to read file');
                }

                console.log('File read successfully');

                const pdfBytes = new Uint8Array(this.result);
                const pdfDoc = await PDFDocument.load(pdfBytes);
                console.log('PDF document loaded');

                const form = pdfDoc.getForm();
                console.log('Form object retrieved');

                // Ensure the AcroForm exists
                let acroForm = pdfDoc.catalog.getOrCreateAcroForm();
                console.log('AcroForm ensured');

                // Create a signature field
                const signatureField = form.createSignature('signature');
                console.log('Signature field created');

                signatureField.addToPage(pdfDoc.getPage(0), {
                    x: 50,
                    y: 500,
                    width: 200,
                    height: 50,
                    borderColor: rgb(1, 0, 0),  // Red border
                    borderWidth: 2,
                });
                console.log('Signature field added to page');

                // Create a text field
                const textField = form.createTextField('textInput');
                console.log('Text field created');

                textField.addToPage(pdfDoc.getPage(0), {
                    x: 50,
                    y: 400,
                    width: 200,
                    height: 30,
                    borderColor: rgb(0, 0, 1),  // Blue border
                    borderWidth: 1,
                });
                console.log('Text field added to page');

                // Save the modified PDF
                const modifiedPdfBytes = await pdfDoc.save();
                console.log('PDF saved with modifications');

                const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
                console.log('Blob created from modified PDF');

                // Trigger download of the modified PDF
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'modified_document.pdf';
                console.log('Download link created');

                link.click();
                console.log('Download initiated');
            };
            fileReader.readAsArrayBuffer(pdfFile);
        } catch (error) {
            console.error('Error modifying PDF:', error);
            alert('An error occurred while modifying the PDF.');
        }
    };

    return (
        <div>
            <h1>PDF Form Field Adder</h1>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={modifyPdf}>Modify PDF</button>
        </div>
    );
};

export default PdfModifier;
