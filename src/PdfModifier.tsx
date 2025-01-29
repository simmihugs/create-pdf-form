import React, { useState, ChangeEvent } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

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

                const pdfBytes = new Uint8Array(this.result);

                // Load the PDF document
                const pdfDoc = await PDFDocument.load(pdfBytes);
                console.log('PDF loaded:', pdfDoc);

                // Get the first page of the document
                const page = pdfDoc.getPage(0);

                // Get the form
                const form = pdfDoc.getForm();

                // Create a text field
                const textField = form.createTextField('myTextField');
                textField.addToPage(page, {
                    x: 50,
                    y: 500,
                    width: 200,
                    height: 50,
                    borderColor: rgb(0, 0, 1),
                    borderWidth: 1,
                });
                console.log('Text field added');

                // Create another text field (instead of signature field)
                const anotherTextField = form.createTextField('anotherTextField');
                anotherTextField.addToPage(page, {
                    x: 50,
                    y: 400,
                    width: 200,
                    height: 50,
                    borderColor: rgb(1, 0, 0),
                    borderWidth: 1,
                });
                console.log('Another text field added');

                // Save the modified PDF
                console.log('Attempting to save PDF...');
                const modifiedPdfBytes = await pdfDoc.save();
                console.log('PDF saved successfully');

                const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
                console.log('Blob created');

                // Trigger download of the modified PDF
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'modified_document.pdf';
                console.log('Downloading modified PDF');
                link.click();
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
