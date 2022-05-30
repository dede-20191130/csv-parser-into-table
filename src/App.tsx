import { Box, Button, Container, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';
import Papa from 'papaparse';

const Input = styled('input')({
  display: 'none',
});

function checkIfUrl(str: string) {
  return (/^https?\:\/\//.test(str));
}

function App() {
  const [fileData, setFileData] = useState<string[][]>([]);
  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!(
      event.target.files !== null &&
      event.target?.files?.length > 0
    )) return;

    const tgtFile = event.target.files[0];
    if (tgtFile.type !== "text/csv") return;

    Papa.parse<string[], File>(tgtFile, {
      header: false,
      complete: (results) => {
        setFileData(results.data);
      }
    })


  };
  return (
    <Container className="App">
      <Typography sx={{ fontSize: "2rem" }} variant='h1'>CSV Parser Into Table</Typography>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <label htmlFor="contained-button-file">
          <Input accept="text/csv" id="contained-button-file" type="file" onChange={handleChange} />
          <Button variant="contained" component="span">
            Import
          </Button>
        </label>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {fileData.map((fileDataLine) => (
              <TableRow
                key={fileDataLine.join("-")}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {fileDataLine.map((item) => {
                  const cellContent = checkIfUrl(item.trim()) ? <a href={item} target="_blank">{item}</a> : item;
                  return <TableCell key={item} align="center">{cellContent}</TableCell>
                })}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
