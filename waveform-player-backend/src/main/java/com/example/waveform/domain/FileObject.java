package com.example.waveform.domain;


public class FileObject {

    private String name;
    private float size;
    //private long length;

    public FileObject(String name, float size) {
        this.name = name;
        this.size = size;
        //this.length = length;
    }

    public String getName() {
        return name;
    }

    public float getSize() {
        return size;
    }
}
