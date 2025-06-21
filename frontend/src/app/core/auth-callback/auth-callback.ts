import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.auth.loadUser();
    this.router.navigate(['/']);
  }
}
