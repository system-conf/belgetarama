import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Container, Typography, Alert } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Scanner() {
  const webcamRef = useRef(null);
  const [taranmisResim, setTaranmisResim] = useState(null);
  const [kameraIzni, setKameraIzni] = useState('beklemede');

  const kameraIzniIste = () => {
    setKameraIzni('beklemede');
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment' // Arka kamerayı kullan
      } 
    })
    .then(() => {
      setKameraIzni('verildi');
    })
    .catch((err) => {
      console.error('Kamera izni hatası:', err);
      setKameraIzni('reddedildi');
    });
  };

  useEffect(() => {
    kameraIzniIste();
  }, []);

  const resimCek = () => {
    const resim = webcamRef.current.getScreenshot();
    setTaranmisResim(resim);
  };

  const pdfOlustur = () => {
    if (!taranmisResim) return;

    const pdf = new jsPDF();
    pdf.addImage(taranmisResim, 'JPEG', 0, 0, 210, 297);
    pdf.save('taranan-belge.pdf');
  };

  if (kameraIzni === 'beklemede') {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h6">
            Kamera izni bekleniyor...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (kameraIzni === 'reddedildi') {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Kamera izni reddedildi. Lütfen tarayıcı ayarlarından kamera iznini etkinleştirin.
          </Alert>
          <Button variant="contained" onClick={kameraIzniIste}>
            Kamera İznini Tekrar İste
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%' }}
          videoConstraints={{
            facingMode: 'environment' // Arka kamerayı kullan
          }}
        />
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={resimCek}>
            Belge Tara
          </Button>
          
          <Button 
            variant="contained" 
            onClick={pdfOlustur}
            disabled={!taranmisResim}
          >
            PDF Oluştur
          </Button>
        </Box>

        {taranmisResim && (
          <Box sx={{ mt: 2 }}>
            <img 
              src={taranmisResim} 
              alt="Taranan Belge" 
              style={{ width: '100%' }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Scanner; 