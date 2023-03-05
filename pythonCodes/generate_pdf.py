import os
from datetime import datetime
from PyPDF4 import PdfFileWriter, PdfFileReader

# Create a new PDF file
output_pdf = PdfFileWriter()

# Add a new page to the PDF file
page = output_pdf.addBlankPage(width=72, height=72)

# Set the page content
# page.mergePage(PdfFileReader(open("input.pdf", "rb")).getPage(0))

# Add metadata to the PDF file
output_pdf.addMetadata({
    '/Title': 'My PDF',
    '/Author': 'John Doe',
    '/Creator': 'My Python Script',
    '/CreationDate': datetime.now().isoformat(),
    '/ModDate': datetime.now().isoformat(),
})

# Save the PDF file
with open('..//server//pdfGenerated//output.pdf', 'wb') as f:
    output_pdf.write(f)

# Print a success message
print('PDF generated successfully')
