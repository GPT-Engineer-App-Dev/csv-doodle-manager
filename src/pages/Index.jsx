import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Download, Upload, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CSVEditor = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setCsvData(results.data.slice(1));
      },
      header: false,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCellEdit = (rowIndex, columnIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][columnIndex] = value;
    setCsvData(newData);
  };

  const addRow = () => {
    setCsvData([...csvData, new Array(headers.length).fill('')]);
  };

  const deleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse([headers, ...csvData]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <FileSpreadsheet className="mr-2 h-6 w-6 text-primary" />
            CSV Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-primary/50 rounded-lg p-12 mb-4 text-center cursor-pointer transition-colors hover:border-primary"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the CSV file here ...</p>
            ) : (
              <p className="text-lg font-medium">Drag 'n' drop a CSV file here, or click to select one</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center justify-between">
              <span>CSV Data</span>
              <Badge variant="secondary">{csvData.length} rows</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead key={index} className="font-bold">{header}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Input
                            value={cell}
                            onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button variant="destructive" size="icon" onClick={() => deleteRow(rowIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 flex justify-between">
              <Button onClick={addRow} variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Row
              </Button>
              <Button onClick={downloadCSV} variant="default">
                <Download className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CSVEditor;
