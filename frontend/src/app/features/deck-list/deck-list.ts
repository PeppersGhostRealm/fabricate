import { Component, OnInit } from '@angular/core';
import { Deck, Decks } from '../../services/decks';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-deck-list',
  imports: [RouterLink],
  templateUrl: './deck-list.html',
  styleUrl: './deck-list.scss',
})
export class DeckList implements OnInit {
  decks: Deck[] = [];

  constructor(private deckService: Decks, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.deckService.list().subscribe({
      next: (d) => {
        this.decks = d;
      },
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this deck?')) return;
    this.deckService.delete(String(id)).subscribe({ next: () => this.load() });
  }
}
