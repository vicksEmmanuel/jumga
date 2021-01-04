import { Container } from "unstated";
import instance from '../helpers/axiosly';
import CONSTANTS from '../App.constant';

class FootballContainer extends Container {
    
    constructor() {
        super();
        this.state = {
            teams: [],
            footBallCompetitions: []
        }
    }

    getTeams = async () => {
        try {
            let teams = await instance.get(`team/sport/${CONSTANTS.SPORTS.Football}`);
            if(teams.data?.isSuccess) {
                this.setState({...this.state, teams: teams.data.data})
            }
        } catch(e) { console.log(e)}
    }

    setTeam = (team) => {
        this.setState({...this.state, teams: this.state.teams.unshift(team)});
    }
    addCompetition = (competition) => {
        this.setState({...this.state, footBallCompetitions: this.state.footBallCompetitions.push(competition)})
    }

    getCompetition = async () => {
        try {
            let competitionBasedOnSport = await instance.get(`sport/competition/${CONSTANTS.SPORTS.Football}`);
            if (competitionBasedOnSport.data?.isSuccess) {
                this.setState({...this.state, footBallCompetitions: competitionBasedOnSport.data.data})
            }
        } catch(e) { console.log(e)}
    }

    getCompetitionById = async (id) => {
        try {
            let competitionById = await instance.get(`competition/${id}`);
            if (competitionById.data?.isSuccess) {
                return competitionById.data.data;
            }
            return null;
        } catch(e) { 
            console.log(e);
            return null;
        }
    }

}

export { FootballContainer }