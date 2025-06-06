import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../models/player.model';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LeagueService } from '../../services/league.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-card',
  imports: [DragDropModule, CommonModule],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css'
})
export class PlayerCard implements OnInit {
  @Input() player!: Player;
  teamLogoUrl!: Promise<string>

  constructor(private readonly leagueService: LeagueService){}

  ngOnInit(): void {
    this.teamLogoUrl = this.leagueService.getTeamByPlayer(this.player.id).then(team => team.imageUrl);
  }

  
}
