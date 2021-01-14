package com.example.waveform.controllers.REST;

import com.example.waveform.domain.FileObject;
import com.example.waveform.services.REST.WaveFileService;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class WavePlayerController {

    @Value( "${wavefiles.folder}" )
    private String FILE_PATH;

    @Autowired
    WaveFileService waveFileService;

    @GetMapping("/fileList")
    List<FileObject> all() throws IOException {
        return waveFileService.getFilesInFolder();
    }

    @DeleteMapping("/deleteFile")
    ResponseEntity<?> deleteFile(@RequestParam(value = "fileName") String fileName) {
        boolean deleted = waveFileService.deleteFile(fileName);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

    }
    @DeleteMapping("/deleteFile/{name}")
    @ResponseBody
    ResponseEntity<?> deleteById(@PathVariable("name") String name){
        try{
            waveFileService.deleteFile(name);
            return ResponseEntity.status(HttpStatus.OK).body("File deleted");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Error while deleting file");
        }
    }

    @GetMapping(
            value = "/getFile",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public @ResponseBody
    byte[] getFile(@RequestParam(value = "fileName") String fileName) throws IOException {
        byte[] bytes = null;
        File file = new File(FILE_PATH + "\\" + fileName);
        try (DataInputStream dis = new DataInputStream(new FileInputStream(file))){
            bytes = dis.readAllBytes();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return bytes;
    }


    @PostMapping("/uploadFile")
    public ResponseEntity<?> handleFileUpload(@RequestParam("file") MultipartFile file, HttpSession session) {
        Path rootLocation = Paths.get(FILE_PATH);
        String message;
        try {
            try {
                Files.copy(file.getInputStream(), rootLocation.resolve(file.getOriginalFilename()));
            } catch (Exception e) {
                throw new RuntimeException("FAIL!");
            }

            message = "Successfully uploaded!";
            return ResponseEntity.status(HttpStatus.OK).body(message);
        } catch (Exception e) {
            message = "Failed to upload!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
        }
    }


}
