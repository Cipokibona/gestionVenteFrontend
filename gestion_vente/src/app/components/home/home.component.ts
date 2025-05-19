import { Component } from '@angular/core';
import { AgentCommercialComponent } from "./agent-commercial/agent-commercial.component";

@Component({
  selector: 'app-home',
  imports: [AgentCommercialComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
