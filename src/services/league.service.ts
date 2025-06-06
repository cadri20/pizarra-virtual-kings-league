import { Injectable } from "@angular/core";
import { Player } from "../models/player.model";
import { Team } from "../models/team.model";
import { League } from "../models/league.model";

export abstract class LeagueService {
    abstract getLeagues(): Promise<League[]>;
    abstract getLeagueById(leagueId: string): Promise<League>;
    abstract getTeamsByLeague(leagueId: number): Promise<Team[]>;
    abstract getPlayersByTeam(teamId: number): Promise<Player[]>;
    abstract getPlayerById(playerId: string): Promise<Player>;
    abstract getTeamByPlayer(playerId: number): Promise<Team>;
}

@Injectable({
    providedIn: 'root'
})
export class LocalLeagueService extends LeagueService {
    private leagues: League[] = [];
    private teams: Team[] = [];
    private players: Player[] = [];

    constructor() {
        super();
        // Initialize with some dummy data
        this.leagues = [
            { id: 1, name: 'Kings League', imageUrl: 'https://kingsleague.pro/_ipx/s_256x256/kama/production/team/27891359.png', country: 'England', lastUpdated: new Date() },
            { id: 2, name: 'La Liga', imageUrl: 'https://kingsleague.pro/_ipx/s_256x256/kama/production/team/27891359.png', country: 'Spain', lastUpdated: new Date() }
        ];
        this.teams = [
            { id: 1, name: 'Ultimate Mostoles', imageUrl: 'https://kingsleague.pro/_ipx/s_256x256/kama/production/team/27891359.png', leagueId: 1 },
            { id: 2, name: 'Team B', imageUrl: 'https://example.com/team-b.png', leagueId: 1 }
        ];
        this.players = [
            { id: 1, imageUrl: 'https://kingsleague.pro/_ipx/s_128x180/https://kingsleague-cdn.kama.football/account/production/seasonTeamPlayer/23a615f1-b278-42b3-956e-e3fcaf12511c/161228500.png', positionCode: 'DEF', name: 'Aleix Hernando', teamId: 1 },
            { id: 2, imageUrl: 'https://kingsleague.pro/_ipx/s_128x180/https://kingsleague-cdn.kama.football/account/production/seasonTeamPlayer/d62660b1-fb86-4d5c-a181-62fa79754b57/871892684.png', positionCode: 'DEL', name: 'Kilian Onorato', teamId: 1 },
            { id: 3, imageUrl: 'https://kingsleague.pro/_ipx/s_128x180/https://kingsleague-cdn.kama.football/account/production/seasonTeamPlayer/2877fdf4-c7c9-40d6-871f-b0d5de6f779b/926963455.png', positionCode: 'DEL', name: 'Mario Reyes', teamId: 1 },
            { id: 4, imageUrl: 'https://kingsleague.pro/_ipx/s_128x180/https://kingsleague-cdn.kama.football/account/production/seasonTeamPlayer/2877fdf4-c7c9-40d6-871f-b0d5de6f779b/926963455.png', positionCode: 'DEL', name: 'Mario Reyes', teamId: 2 }
        ];
    }

    async getLeagues(): Promise<League[]> {
        return this.leagues;
    }

    async getLeagueById(leagueId: string): Promise<League> {
        const league = this.leagues.find(l => l.id.toString() === leagueId);
        if (!league) {
            throw new Error(`League with id ${leagueId} not found`);
        }
        return league;
    }

    async getTeamsByLeague(leagueId: number): Promise<Team[]> {
        const teams = this.teams.filter(t => t.leagueId === leagueId);
        if (teams.length === 0) {
            throw new Error(`No teams found for league with id ${leagueId}`);
        }
        return teams;
    }

    async getPlayersByLeague(leagueId: string): Promise<Player[]> {
        const players = this.players.filter(p => p.teamId.toString() === leagueId);
        if (players.length === 0) {
            throw new Error(`No players found for league with id ${leagueId}`);
        }
        return players;
    }

    async getPlayerById(playerId: string): Promise<Player> {
        const player = this.players.find(p => p.id.toString() === playerId);
        if (!player) {
            throw new Error(`Player with id ${playerId} not found`);
        }
        return player;
    }

    override getTeamByPlayer(playerId: number): Promise<Team> {
        const player = this.players.find(p => p.id === playerId);
        if (!player) {
            throw new Error(`Player with id ${playerId} not found`);
        }
        const team = this.teams.find(t => t.id === player.teamId);
        if (!team) {
            throw new Error(`Team for player with id ${playerId} not found`);
        }
        return Promise.resolve(team);
    }

    override getPlayersByTeam(teamid: number): Promise<Player[]> {
        const players = this.players.filter(p => p.teamId === teamid);
        if (players.length === 0) {
            throw new Error(`No players found for team with id ${teamid}`);
        }
        return Promise.resolve(players);

    }

}