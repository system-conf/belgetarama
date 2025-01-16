import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { 
  Button, 
  Box, 
  Container, 
  Typography, 
  Alert,
  Paper,
  IconButton
} from '@mui/material';
import { 
  CameraAlt as CameraIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';
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
        facingMode: 'environment'
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
      <Container maxWidth="sm">
        <Box sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <Typography variant="h1">
            Belge Tarayıcı
          </Typography>
          <Paper sx={{ p: 3, width: '100%', textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Kamera izni bekleniyor...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (kameraIzni === 'reddedildi') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <Typography variant="h1">
            Belge Tarayıcı
          </Typography>
          <Paper sx={{ p: 3, width: '100%', bgcolor: 'background.paper' }}>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={kameraIzniIste}
                >
                  <RefreshIcon />
                </IconButton>
              }
            >
              Kamera izni reddedildi. Lütfen tarayıcı ayarlarından kamera iznini etkinleştirin.
            </Alert>
            <Button 
              variant="contained" 
              onClick={kameraIzniIste}
              startIcon={<CameraIcon />}
              fullWidth
            >
              Kamera İznini Tekrar İste
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        my: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2 
      }}>
        <Typography variant="h1">
          Belge Tarayıcı
        </Typography>
        <Paper sx={{ p: 2, width: '100%', bgcolor: 'background.paper' }}>
          <Box sx={{ 
            position: 'relative', 
            width: '100%',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 2
          }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ 
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              videoConstraints={{
                facingMode: 'environment'
              }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button 
              variant="contained" 
              onClick={resimCek}
              startIcon={<CameraIcon />}
              fullWidth
            >
              Belge Tara
            </Button>
            
            <Button 
              variant="contained" 
              onClick={pdfOlustur}
              disabled={!taranmisResim}
              startIcon={<PdfIcon />}
              fullWidth
            >
              PDF Oluştur
            </Button>
          </Box>
        </Paper>

        {taranmisResim && (
          <Paper sx={{ p: 2, width: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Taranan Belge
            </Typography>
            <Box sx={{ 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <img 
                src={taranmisResim} 
                alt="Taranan Belge" 
                style={{ 
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Scanner; 