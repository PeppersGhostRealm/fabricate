import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Deck, Decks } from '../../services/decks';

@Component({
  selector: 'app-deck-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './deck-edit.html',
  styleUrl: './deck-edit.scss',
})
export class DeckEdit implements OnInit {
  deck: Partial<Deck> = { name: '', content: '' };
  isNew = true;

  constructor(
    private deckService: Decks,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.deckService.get(id).subscribe({ next: (d) => (this.deck = d) });
    }
  }

  save(): void {
    if (this.isNew) {
      this.deckService
        .create({ name: this.deck.name!, content: this.deck.content! })
        .subscribe({ next: () => this.router.navigate(['/decks']) });
    } else {
      const id = this.route.snapshot.paramMap.get('id')!;
      this.deckService
        .update(id, { name: this.deck.name!, content: this.deck.content! })
        .subscribe({ next: () => this.router.navigate(['/decks']) });
    }
  }
}
