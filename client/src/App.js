import React, { useState } from "react";
import axios from "axios";
// constants
import { USER_ENDPOINT } from "./constants/endpoints";
// mui
import { Container, Slider, Stack, TextField, Typography, Button, Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// vars
const marks = [
  {
    value: 0,
    label: "0 KM",
  },
  {
    value: 25,
    label: "25 KM",
  },
  {
    value: 50,
    label: "50 KM",
  },
  {
    value: 100,
    label: "100 KM",
  },
];

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [range, setRange] = useState(10);
  const [location, setLocation] = useState({});
  const [user, setUser] = useState(null);
  const [users, setUsers] = React.useState([]);

  const getCurrLocation = () => navigator.geolocation.getCurrentPosition((position) => (user ? setUser((user) => ({ ...user, location: { lg: position.coords.longitude, la: position.coords.latitude } })) : setLocation({ lg: position.coords.longitude, la: position.coords.latitude })));

  const handleSearch = () => {
    setIsSearching(true);
    axios
      .get(USER_ENDPOINT, { params: { location, range } })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        setIsSearching(false);
      })
      .catch((err) => {
        console.log(err);
        setUsers([]);
        alert("No roommates found!");
        setIsSearching(false);
      });
  };

  const handleNewUser = () => {
    if (user) {
      setIsLoading(true);
      axios
        .post(USER_ENDPOINT, { ...user, date: new Date().toISOString() })
        .then((res) => {
          setIsLoading(false);
          setUser(null);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setUser(null);
        });
    }
  };

  return (
    <Container sx={{ width: "100vw", minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Stack alignItems="center" sx={{ maxWidth: "400px", width: "100%", margin: "auto", p: 2 }}>
        <Typography variant="h4" color="primary" align="center">
          Roommate Finder
        </Typography>
        <Typography variant="body1" color="secondary" sx={{ mb: 4 }} align="center">
          Find roommates near you!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ width: "100%" }}>
          Target Location
        </Typography>
        <Stack direction="row" spacing={1} sx={{ width: "100%", mb: 2 }}>
          <TextField variant="standard" label="Longitude" placeholder="Longitude" value={location.lg || 0} onChange={(e) => setLocation((location) => ({ ...location, lg: e.target.value }))} />
          <TextField variant="standard" label="Lattitude" placeholder="Lattitude" value={location.la || 0} onChange={(e) => setLocation((location) => ({ ...location, la: e.target.value }))} />
        </Stack>
        <Button startIcon={<AddLocationIcon />} variant="outlined" onClick={getCurrLocation} sx={{ mb: 2 }}>
          Update Current Location
        </Button>
        <Typography variant="body1" color="text.secondary" sx={{ width: "100%" }}>
          Set Search Range
        </Typography>
        <Slider value={range} onChange={(e, range) => setRange(range)} step={0.01} marks={marks} valueLabelDisplay="on" sx={{ my: 4 }} />
        <LoadingButton disabled={!location.la || !location.lg} variant="contained" onClick={() => handleSearch()} loading={isSearching} startIcon={<SearchIcon />}>
          {location.la && location.lg ? "Search" : "Enter Location First!"}
        </LoadingButton>
        <Divider sx={{ my: 4, width: "100%" }}>
          <Chip label="OR" />
        </Divider>
        <Button onClick={() => setUser({})} variant="contained" color="secondary" startIcon={<AddIcon />}>
          Add your location!
        </Button>
        <Dialog open={Boolean(user)} onClose={() => setUser(null)}>
          <DialogTitle id="alert-dialog-title">Add your location and let others find you!</DialogTitle>
          <DialogContent>
            {user ? (
              <Stack spacing={2}>
                <TextField required variant="standard" label="Name" placeholder="What's your name?" value={user?.name || ""} onChange={(e) => setUser((user) => ({ ...user, name: e.target.value }))} />
                <TextField required multiline rows={4} label="Contact" placeholder="Contact Information" value={user?.contact || ""} onChange={(e) => setUser((user) => ({ ...user, contact: e.target.value }))} />
                <Typography variant="body1" color="text.secondary" sx={{ width: "100%" }}>
                  Your Location
                </Typography>
                <Stack direction="row" spacing={1} sx={{ width: "100%", mb: 2 }}>
                  <TextField required variant="standard" label="Longitude" placeholder="Longitude" value={user.location?.lg || 0} onChange={(e) => setUser((user) => ({ ...user, location: { ...(user.location || {}), lg: e.target.value } }))} />
                  <TextField required variant="standard" label="Lattitude" placeholder="Lattitude" value={user.location?.la || 0} onChange={(e) => setUser((user) => ({ ...user, location: { ...(user.location || {}), la: e.target.value } }))} />
                </Stack>
                <Button startIcon={<AddLocationIcon />} variant="outlined" onClick={getCurrLocation} sx={{ mb: 2 }}>
                  Update Current Location
                </Button>
                {!(user && user.name && user.contact && user.location && user.location.lg && user.location.la) ? (
                  <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
                    Fill all the details to continue!
                  </Typography>
                ) : null}
              </Stack>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button fullWidth startIcon={<CloseIcon />} variant="outlined" onClick={() => setUser(null)}>
              Cancel
            </Button>
            <LoadingButton disabled={!(user && user.name && user.contact && user.location && user.location.lg && user.location.la)} fullWidth startIcon={<AddIcon />} loading={isLoading} variant="contained" onClick={() => handleNewUser()} autoFocus>
              Add
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <Dialog open={Boolean(users.length)} onClose={() => setUsers([])}>
          <DialogTitle>List of users near specified location range!</DialogTitle>
          <DialogContent>
            {users.length ? (
              <Stack spacing={2}>
                {users.map((user, index) => (
                  <Accordion key={user._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{index + 1 + ". " + user.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Contact Information
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {user.contact}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.date).toLocaleString()}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            ) : null}
          </DialogContent>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default App;
