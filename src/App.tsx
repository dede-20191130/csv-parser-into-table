import { Box, Button, Container, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';
import Papa from 'papaparse';
import GitHubIcon from '@mui/icons-material/GitHub';

const Input = styled('input')({
  display: 'none',
});

function checkIfUrl(str: string) {
  return (/^https?\:\/\//.test(str));
}

function checkIfNumber(item: string) {
  return !isNaN(Number(item));
}

function checkIfDateFormat(item: string) {
  const d = new Date(item);
  return d instanceof Date && !isNaN(d.valueOf());
}

function prettifyDate(dateString: string) {
  const d = new Date(dateString);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

function formattedCellContent(item: string) {
  let returnContent: string | JSX.Element;
  if (!(item.trim())) {
    returnContent = "";
  } else if (checkIfUrl(item.trim())) {
    returnContent = <a href={item.trim()} target="_blank">{item.trim()}</a>
  } else if (checkIfNumber(item.trim())) {
    returnContent = Number(item).toLocaleString("en-US");
  } else if (checkIfDateFormat(item.trim())) {
    returnContent = prettifyDate(item.trim());
  } else {
    returnContent = item;
  }
  return returnContent;
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
        console.log(results.data);
      }
    })


  };
  return (
    <Container className="App">
      <Typography sx={{ fontSize: "2rem" }} variant='h1'>CSV Parser Into Table</Typography>
      <Typography variant='caption'>
        All URL strings in csv are transformed into a Link element.<br />
        <a href="https://github.com/dede-20191130/csv-parser-into-table" target="_blank"><GitHubIcon ></GitHubIcon></a>
      </Typography>
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
                  return <TableCell key={item} align="left">{formattedCellContent(item)}</TableCell>
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
