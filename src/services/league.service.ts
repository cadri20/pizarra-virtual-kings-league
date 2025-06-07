import { Injectable } from "@angular/core";
import { Player } from "../models/player.model";
import { Team } from "../models/team.model";
import { League } from "../models/league.model";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

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

    constructor(private http: HttpClient) {
        super();
        
    }

    async loadData(){
        try {
            ;
            this.teams = await firstValueFrom(this.http.get<Team[]>('/assets/data/teams.json'));
            this.players = await firstValueFrom(this.http.get<Player[]>('/assets/data/players.json'));
        } catch (error) {
            console.error('Error loading data:', error);
            throw new Error('Failed to load data');
        }

    }

    async getLeagues(): Promise<League[]> {
        if(this.leagues.length === 0) {
            this.leagues = await firstValueFrom(this.http.get<League[]>('/assets/data/leagues.json'))
        }

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
        if (this.teams.length === 0) {
            this.teams = await firstValueFrom(this.http.get<Team[]>('/assets/data/teams.json'));
        }

        const teams = this.teams.filter(t => t.leagueId === leagueId);
        if (teams.length === 0) {
            throw new Error(`No teams found for league with id ${leagueId}`);
        }
        return teams;
    }

    async getPlayersByLeague(leagueId: string): Promise<Player[]> {
        if (this.players.length === 0) {
            this.players = await firstValueFrom(this.http.get<Player[]>('/assets/data/players.json'));
        }
        
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

    override async getPlayersByTeam(teamid: number): Promise<Player[]> {
        if (this.players.length === 0) {
            this.players = await firstValueFrom(this.http.get<Player[]>('/assets/data/players.json'));
        }
        
        const players = this.players.filter(p => p.teamId === teamid);
        if (players.length === 0) {
            throw new Error(`No players found for team with id ${teamid}`);
        }
        return Promise.resolve(players);

    }

}