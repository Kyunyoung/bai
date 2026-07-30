using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Data.Pdf;
using Windows.Storage;

class Program {
    static void Main(string[] args) {
        try {
            string pdfPath = @"c:\Users\1\Desktop\bai\vibe_coding_55_scenario_offline_install_added.pdf";
            string outDir = @"c:\Users\1\Desktop\bai\slides_media";
            
            if (!Directory.Exists(outDir)) {
                Directory.CreateDirectory(outDir);
            }
            
            var storageFile = StorageFile.GetFileFromPathAsync(pdfPath).GetAwaiter().GetResult();
            var pdfDoc = PdfDocument.LoadFromFileAsync(storageFile).GetAwaiter().GetResult();
            uint count = pdfDoc.PageCount;
            Console.WriteLine("Direct PDF Page Count: " + count);
            
            for (uint i = 0; i < count; i++) {
                using (var page = pdfDoc.GetPage(i)) {
                    var stream = new Windows.Storage.Streams.InMemoryRandomAccessStream();
                    var options = new PdfPageRenderOptions();
                    options.DestinationWidth = 1920; // 1920px width high-res
                    page.RenderToStreamAsync(stream, options).GetAwaiter().GetResult();
                    
                    using (var netStream = WindowsRuntimeStreamExtensions.AsStream(stream))
                    using (var img = Image.FromStream(netStream)) {
                        string outFile = Path.Combine(outDir, "slide_" + (i + 1) + ".jpg");
                        img.Save(outFile, ImageFormat.Jpeg);
                        Console.WriteLine("Rendered PDF Page " + (i + 1) + " / " + count + " -> " + outFile + " (" + new FileInfo(outFile).Length + " bytes)");
                    }
                }
            }
            Console.WriteLine("SUCCESS: All " + count + " PDF pages rendered directly to slides_media!");
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message + "\n" + ex.StackTrace);
        }
    }
}
