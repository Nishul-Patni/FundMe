import './App.css';
import Navbar from './Components/Navbar';
import Campaigns from './Components/Campaigns';
import NewCampaign from './Components/NewCampaign';
import { Container } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import ViewCampaign from './Components/ViewCampaign';
import Requests from './Components/Request/Requests';
import NewRequest from './Components/Request/NewRequest';

function App() {
  
  return (
    <Router>
      <Navbar/>
      <Container>
        <Routes>
          <Route exact path='/' element={<Campaigns/>}/>
          <Route exact path='newCampaign' element={<NewCampaign/>}/>
          <Route exact path='/viewCampaign/:id' element={<ViewCampaign/>}/>
          <Route exact path='/viewCampaign/:id/requests' element={<Requests/>}/>
          <Route exact path='/viewCampaign/:id/requests/new' element={<NewRequest/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
