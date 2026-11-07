
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

interface Submission {
  id: string;
  type: string;
  title: string;
  userId: string;
  district: string;
  details: string;
  photoUrl: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-live-verification',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="verification-page">

      <h1>Wayhunter Live Verification</h1>
      <p>Flutter Hunter & Game Photo Approval</p>

      <div class="tabs">
        <button (click)="changeType('hunter')">
          Location Hunter
        </button>

        <button (click)="changeType('game')">
          Create Game
        </button>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>

      <h2>
        {{ type === 'hunter'
          ? 'Hunter Verification Requests'
          : 'Game Verification Requests' }}
      </h2>

      <p *ngIf="records.length === 0">
        No submissions found.
      </p>

      <div class="grid">

        <div class="card" *ngFor="let item of records">

          <img
            [src]="api + item.photoUrl"
            [alt]="item.title"
          />

          <div class="content">
            <h3>{{ item.title }}</h3>

            <p>District: {{ item.district }}</p>
            <p>User: {{ item.userId }}</p>
            <p>{{ item.details }}</p>

            <p>
              Status:
              <strong>{{ item.status }}</strong>
            </p>

            <div *ngIf="item.status === 'Pending'">

              <button
                class="approve"
                (click)="decide(item, 'approve')">
                Approve
              </button>

              <button
                class="reject"
                (click)="decide(item, 'reject')">
                Reject
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  styles: [`
    .verification-page {
      padding: 25px;
      color: white;
    }

    h1 {
      color: #38dfff;
      margin-bottom: 8px;
    }

    .tabs {
      display: flex;
      gap: 12px;
      margin: 24px 0;
    }

    button {
      border: none;
      padding: 11px 18px;
      border-radius: 9px;
      cursor: pointer;
      font-weight: 600;
    }

    .tabs button {
      background: #124266;
      color: white;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .card {
      background: #111d32;
      border: 1px solid #1b7299;
      border-radius: 15px;
      overflow: hidden;
    }

    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .content {
      padding: 17px;
    }

    .approve {
      background: #12bd7c;
      color: white;
    }

    .reject {
      background: #dc405a;
      color: white;
      margin-left: 10px;
    }

    .error {
      color: #ff7385;
    }
  `]
})
export class LiveVerificationPage
  implements OnInit, OnDestroy {

  api = 'http://localhost:5055';

  type = 'hunter';

  records: Submission[] = [];

  error = '';

  private timer?: ReturnType<typeof setInterval>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();

    this.timer = setInterval(() => {
      this.load();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  changeType(type: string): void {
    this.type = type;
    this.load();
  }

  async load(): Promise<void> {
    try {
      const requestedType = this.type;

      const response = await fetch(
        `${this.api}/api/submissions?type=${requestedType}`
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (requestedType === this.type) {
        this.records = data;
        this.error = '';
        this.cdr.detectChanges();
      }

    } catch {
      this.error = 'Cannot connect to Local API';
      this.cdr.detectChanges();
    }
  }

  async decide(
    item: Submission,
    action: 'approve' | 'reject'
  ): Promise<void> {

    if (!confirm(`${action} ${item.title}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${this.api}/api/submissions/${item.id}/${action}`,
        {
          method: 'PATCH'
        }
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      await this.load();

    } catch {
      this.error = 'Unable to update submission';
      this.cdr.detectChanges();
    }
  }
}
