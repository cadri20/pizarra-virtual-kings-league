import { Component, OnInit } from '@angular/core';
import { PlayerCard } from "../player-card/player-card";
import { Player } from '../../models/player.model';
import { LeagueService, LocalLeagueService } from '../../services/league.service';
import { CommonModule } from '@angular/common';
import { League } from '../../models/league.model';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-board',
  imports: [PlayerCard, CommonModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit{
  players! : Promise<Player[]>;
  leagues! : Promise<League[]>;
  teams! : Promise<Team[]>;
  playersOnBoard: Player[] = [];

  selectedPlayer!: Player;
  selectedLeague!: League;
  selectedTeam!: Team;

  constructor(
    private readonly leagueService: LeagueService
  ){
  }

  async ngOnInit() {
    this.leagues = this.leagueService.getLeagues();
  }

  selectLeague(league: League) {
    this.teams = this.leagueService.getTeamsByLeague(league.id);
    this.selectedLeague = league;
  }

  selectTeam(team: Team) {
    this.players = this.leagueService.getPlayersByTeam(team.id);
    this.selectedTeam = team;
  }

  selectPlayer(player: Player){
    this.selectedPlayer = player;
  }

  addPlayerToBoard() {    

    if (!this.playersOnBoard.some(p => p.id === this.selectedPlayer.id)) {
      this.playersOnBoard.push(this.selectedPlayer);
    }
  }
  deletePlayerFromBoard(player: Player) {
    this.playersOnBoard = this.playersOnBoard.filter(p => p.id !== player.id);
  }

}
