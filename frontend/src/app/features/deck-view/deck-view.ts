import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeckDetails, Decks } from '../../services/decks';

@Component({
  selector: 'app-deck-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './deck-view.html',
  styleUrl: './deck-view.scss',
})
export class DeckView implements OnInit {
  deck?: DeckDetails;

  constructor(private deckService: Decks, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.deckService.details(id).subscribe({ next: (d) => (this.deck = d) });
  }
}
