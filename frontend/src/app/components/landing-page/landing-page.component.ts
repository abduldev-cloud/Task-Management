import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void { }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }

    navigateToRegister() {
        this.router.navigate(['/register']);
    }

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

}
