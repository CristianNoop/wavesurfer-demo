package com.example.waveform.services.REST;

import com.example.waveform.domain.FileObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class WaveFileService {
    @Value( "${wavefiles.folder}" )
    private String FILE_PATH;

    public boolean deleteFile(String fileName) {
        File file = new File(FILE_PATH + "\\" + fileName);
        if (file.exists()) {
            return file.delete();
        }
        return false;
    }

    public List<FileObject> getFilesInFolder() throws IOException {
        File folder = new File(FILE_PATH);
        List<FileObject> result = new ArrayList();
        File[] listOfFiles = folder.listFiles();

        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                Files.size(file.toPath());
                if (file.isFile()) {
                    long fileSizeInBytes = file.length();
                    // Convert the bytes to Kilobytes (1 KB = 1024 Bytes)
                    float fileSizeInKB = fileSizeInBytes / 1024;
                    // Convert the KB to MegaBytes (1 MB = 1024 KBytes)
                    float fileSizeInMB = Math.round(fileSizeInKB / 1024 * 100);
                    fileSizeInMB = fileSizeInMB / 100;

                    result.add(new FileObject(file.getName(), fileSizeInMB));
                }
            }
        }
        return result;
    }
}
