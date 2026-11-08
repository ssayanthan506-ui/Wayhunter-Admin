
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Advertisement,
  AdvertisementApiService,
  CreateAdvertisement
} from './advertisement-api.service';

@Component({
  selector: 'app-advertisements-page',
  standalone: true,
  imports: [FormsModule],

  template: `
    <div class="wh-module" data-module="advertisements">

      <!-- PAGE HEADER -->
      <div class="wh-page-heading">
        <div>
          <div class="wh-eyebrow">
            WAYHUNTER / ADMIN MODULE
          </div>

          <h1>Advertisements</h1>

          <p>
            Manage sponsored banners and promotional campaigns.
          </p>
        </div>

        <div class="wh-heading-actions">
          <button
            class="wh-btn wh-btn-secondary"
            (click)="loadAds()"
          >
            Refresh
          </button>

          <button
            class="wh-btn wh-btn-primary"
            (click)="openCreate()"
          >
            + Create Advertisement
          </button>
        </div>
      </div>

      <!-- LIVE COUNTS -->
      <div class="wh-metric-grid">

        <div class="wh-metric-card">
          <span>Total Records</span>
          <strong>{{ ads.length }}</strong>
          <small>Live API records</small>
        </div>

        <div class="wh-metric-card">
          <span>Filtered Results</span>
          <strong>{{ visibleAds.length }}</strong>
          <small>Search / status filter</small>
        </div>

        <div class="wh-metric-card">
          <span>Require Attention</span>
          <strong>{{ pendingCount }}</strong>
          <small>Pending advertisements</small>
        </div>

        <div class="wh-metric-card">
          <span>Active Ads</span>
          <strong>{{ activeCount }}</strong>
          <small>Currently active campaigns</small>
        </div>

      </div>

      <!-- ADVERTISEMENT TABLE -->
      <section class="wh-table-panel">

        <div class="wh-table-head">
          <div>
            <h2>Advertisement Records</h2>
            <p>
              Manage live advertisement records
            </p>
          </div>

          <div class="wh-toolbar">

            <input
              class="wh-search"
              type="search"
              placeholder="Search advertisements..."
              [(ngModel)]="search"
            />

            <select [(ngModel)]="statusFilter">
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Archived">Archived</option>
            </select>

          </div>
        </div>

        @if (loading) {
          <p class="wh-info-message">
            Loading advertisements...
          </p>
        }

        @if (error) {
          <p class="wh-error-message">
            {{ error }}
          </p>
        }

        <div class="wh-table-scroll">

          <table class="wh-data-table">

            <thead>
              <tr>
                <th>Campaign</th>
                <th>Sponsor</th>
                <th>Placement</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Views</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              @for (ad of visibleAds; track ad.id) {
                <tr>

                  <td>{{ ad.title }}</td>
                  <td>{{ ad.sponsorName }}</td>
                  <td>{{ ad.placement }}</td>

                  <td>
                    {{ ad.startDate.slice(0, 10) }}
                  </td>

                  <td>
                    {{ ad.endDate.slice(0, 10) }}
                  </td>

                  <td>{{ ad.viewCount }}</td>
                  <td>{{ ad.clickCount }}</td>

                  <td>
                    <span
                      class="wh-status"
                      [class.wh-status-good]="ad.status === 'Active'"
                      [class.wh-status-bad]="ad.status === 'Archived'"
                    >
                      {{ ad.status }}
                    </span>
                  </td>

                  <td>
                    <button
                      class="wh-link-button"
                      (click)="showDetails(ad)"
                    >
                      View Details
                    </button>
                  </td>

                </tr>
              }

              @if (!loading && visibleAds.length === 0) {
                <tr>
                  <td
                    colspan="9"
                    class="wh-empty-table"
                  >
                    No advertisements found.
                  </td>
                </tr>
              }

            </tbody>
          </table>
        </div>

        <div class="wh-table-footer">
          Showing {{ visibleAds.length }}
          of {{ ads.length }} records
        </div>

      </section>
    </div>

    <!-- CREATE ADVERTISEMENT MODAL -->
    @if (editorOpen) {

      <div class="wh-modal-overlay">

        <section
          class="wh-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Create advertisement"
        >

          <div class="wh-modal-header">
            <h2>Create Advertisement</h2>

            <button
              class="wh-btn wh-btn-secondary"
              (click)="closeEditor()"
            >
              Close
            </button>
          </div>

          <div class="wh-editor-grid">

            <div class="wh-modal-field">
              <label>Campaign Title</label>

              <input
                [(ngModel)]="form.title"
                placeholder="Campaign title"
              />
            </div>

            <div class="wh-modal-field">
              <label>Sponsor Name</label>

              <input
                [(ngModel)]="form.sponsorName"
                placeholder="Sponsor"
              />
            </div>

            <div class="wh-modal-field">
              <label>Description</label>

              <input
                [(ngModel)]="form.description"
                placeholder="Description"
              />
            </div>

            <!-- IMAGE UPLOAD -->
            <div class="wh-modal-field">

              <label>Advertisement Image</label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                [disabled]="uploadingImage"
                (change)="onImageSelected($event)"
              />

              <small>
                JPG, PNG or WebP - Maximum 5 MB
              </small>

              @if (uploadingImage) {
                <p class="wh-info-message">
                  Uploading image...
                </p>
              }

              @if (form.imageUrl) {
                <div class="wh-image-preview">

                  <img
                    [src]="form.imageUrl"
                    alt="Advertisement image preview"
                  />

                  <p class="wh-upload-success">
                    Image uploaded successfully
                  </p>

                </div>
              }

            </div>

            <div class="wh-modal-field">
              <label>Target URL</label>

              <input
                [(ngModel)]="form.targetUrl"
                placeholder="https://example.com"
              />
            </div>

            <div class="wh-modal-field">
              <label>Placement</label>

              <select [(ngModel)]="form.placement">
                <option value="Home Banner">
                  Home Banner
                </option>
              </select>
            </div>

            <div class="wh-modal-field">
              <label>Target District</label>

              <select [(ngModel)]="form.targetDistrict">
                <option value="All">All Sri Lanka</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>

            </div>

            <div class="wh-modal-field">
              <label>Start Date</label>

              <input
                type="datetime-local"
                [(ngModel)]="form.startDate"
              />
            </div>

            <div class="wh-modal-field">
              <label>End Date</label>

              <input
                type="datetime-local"
                [(ngModel)]="form.endDate"
              />
            </div>

          </div>

          @if (formError) {
            <p class="wh-error-message">
              {{ formError }}
            </p>
          }

          <div class="wh-modal-actions">

            <button
              class="wh-btn wh-btn-primary"
              [disabled]="saving || uploadingImage"
              (click)="createAd()"
            >
              {{ saving ? 'Saving...' : 'Create Advertisement' }}
            </button>

            <button
              class="wh-btn wh-btn-secondary"
              [disabled]="saving || uploadingImage"
              (click)="closeEditor()"
            >
              Cancel
            </button>

          </div>

        </section>
      </div>
    }

    <!-- DETAILS MODAL -->
    @if (selected) {

      <div class="wh-modal-overlay">

        <section
          class="wh-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Advertisement details"
        >

          <div class="wh-modal-header">
            <h2>{{ selected.title }}</h2>

            <button
              class="wh-btn wh-btn-secondary"
              (click)="selected = null"
            >
              Close
            </button>
          </div>

          <div class="wh-detail-grid">

            <div class="wh-detail-item">
              <span>Sponsor</span>
              <strong>
                {{ selected.sponsorName }}
              </strong>
            </div>

            <div class="wh-detail-item">
              <span>District</span>
              <strong>
                {{ selected.targetDistrict }}
              </strong>
            </div>

            <div class="wh-detail-item">
              <span>Placement</span>
              <strong>
                {{ selected.placement }}
              </strong>
            </div>

            <div class="wh-detail-item">
              <span>Status</span>
              <strong>
                {{ selected.status }}
              </strong>
            </div>

            <div class="wh-detail-item">
              <span>Views</span>
              <strong>
                {{ selected.viewCount }}
              </strong>
            </div>

            <div class="wh-detail-item">
              <span>Clicks</span>
              <strong>
                {{ selected.clickCount }}
              </strong>
            </div>

          </div>

          @if (selected.imageUrl) {
            <div class="wh-image-preview">
              <img
                [src]="selected.imageUrl"
                alt="Advertisement image"
              />
            </div>
          }

          @if (error) {
            <p class="wh-error-message">
              {{ error }}
            </p>
          }

          <div class="wh-modal-actions">

            <button
              class="wh-btn wh-btn-primary"
              [disabled]="saving"
              (click)="setStatus('Active')"
            >
              Activate
            </button>

            <button
              class="wh-btn wh-btn-secondary"
              [disabled]="saving"
              (click)="setStatus('Paused')"
            >
              Pause
            </button>

            <button
              class="wh-btn wh-btn-danger"
              [disabled]="saving"
              (click)="setStatus('Archived')"
            >
              Archive
            </button>

          </div>

        </section>
      </div>
    }
  `,

  styles: [`
    .wh-info-message {
      padding: 14px;
      color: #b8c8dc;
    }

    .wh-error-message {
      padding: 12px;
      color: #ff8585;
    }

    .wh-image-preview {
      width: 100%;
      margin-top: 12px;
    }

    .wh-image-preview img {
      width: 100%;
      max-height: 200px;
      object-fit: contain;
      border-radius: 12px;
      border: 1px solid rgba(54, 211, 255, 0.25);
      background: rgba(0, 0, 0, 0.25);
    }

    .wh-upload-success {
      color: #20d8c3;
      font-size: 12px;
      margin-top: 8px;
    }
  `]
})
export class AdvertisementsPage implements OnInit {

  ads: Advertisement[] = [];

  search = '';
  statusFilter = 'All';

  loading = false;
  saving = false;
  uploadingImage = false;

  error = '';
  formError = '';

  editorOpen = false;
  selected: Advertisement | null = null;

  form: CreateAdvertisement = this.emptyForm();

  constructor(
    private api: AdvertisementApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    void this.loadAds();
  }

  private emptyForm(): CreateAdvertisement {
    return {
      title: '',
      sponsorName: '',
      description: '',
      imageUrl: '',
      targetUrl: '',
      placement: 'Home Banner',
      targetDistrict: 'All',
      startDate: '',
      endDate: ''
    };
  }

  get visibleAds(): Advertisement[] {

    const query = this.search
      .toLowerCase()
      .trim();

    return this.ads.filter(ad => {

      const matchStatus =
        this.statusFilter === 'All' ||
        ad.status === this.statusFilter;

      const matchSearch =
        !query ||
        [
          ad.title,
          ad.sponsorName,
          ad.placement,
          ad.targetDistrict
        ].some(value =>
          value.toLowerCase().includes(query)
        );

      return matchStatus && matchSearch;
    });
  }

  get pendingCount(): number {
    return this.ads.filter(
      ad => ad.status === 'Pending'
    ).length;
  }

  get activeCount(): number {

    const now = Date.now();

    return this.ads.filter(ad =>
      ad.status === 'Active' &&
      new Date(ad.startDate).getTime() <= now &&
      new Date(ad.endDate).getTime() >= now
    ).length;
  }

  async loadAds(): Promise<void> {

    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    try {

      this.ads = await this.api.getAll();

      console.log(
        'Advertisements loaded:',
        this.ads
      );

    } catch (error) {

      console.error(
        'Advertisement API error:',
        error
      );

      this.error =
        'Cannot connect to Advertisement API on localhost:5055';

    } finally {

      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  openCreate(): void {

    this.form = this.emptyForm();
    this.formError = '';
    this.error = '';

    this.uploadingImage = false;
    this.editorOpen = true;
  }

  closeEditor(): void {

    if (this.saving || this.uploadingImage) {
      return;
    }

    this.editorOpen = false;
  }

  async onImageSelected(
    event: Event
  ): Promise<void> {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.formError = '';
    this.form.imageUrl = '';

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.formError =
        'Only JPG, PNG or WebP images allowed.';

      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      this.formError =
        'Maximum image size is 5 MB.';

      input.value = '';
      return;
    }

    this.uploadingImage = true;
    this.cdr.markForCheck();

    try {

      const imageUrl =
        await this.api.uploadImage(file);

      this.form.imageUrl = imageUrl;

      console.log(
        'Advertisement image uploaded:',
        imageUrl
      );

    } catch (error) {

      console.error(
        'Advertisement upload failed:',
        error
      );

      this.formError =
        'Image upload failed. Check that the API is running.';

    } finally {

      this.uploadingImage = false;
      input.value = '';
      this.cdr.markForCheck();
    }
  }

  async createAd(): Promise<void> {

    if (this.saving || this.uploadingImage) {
      return;
    }

    this.formError = '';

    if (
      !this.form.title.trim() ||
      !this.form.sponsorName.trim() ||
      !this.form.startDate ||
      !this.form.endDate
    ) {

      this.formError =
        'Title, Sponsor and dates are required.';

      return;
    }

    const start =
      new Date(this.form.startDate);

    const end =
      new Date(this.form.endDate);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end <= start
    ) {

      this.formError =
        'Please enter a valid date range.';

      return;
    }

    if (
      this.form.targetUrl.trim() &&
      !/^https:\/\/[^ ]+$/i.test(
        this.form.targetUrl.trim()
      )
    ) {
      this.formError =
        'Target URL must start with https://';
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();

    try {

      const advertisement: CreateAdvertisement = {
        ...this.form,

        title: this.form.title.trim(),
        sponsorName: this.form.sponsorName.trim(),

        startDate: start.toISOString(),
        endDate: end.toISOString()
      };

      await this.api.create(advertisement);

      this.editorOpen = false;

      await this.loadAds();

    } catch (error) {

      console.error(
        'Create advertisement failed:',
        error
      );

      this.formError =
        'Cannot save advertisement. Check the API.';

    } finally {

      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  showDetails(ad: Advertisement): void {

    this.selected = ad;
    this.error = '';
  }

  async setStatus(
    status: 'Active' | 'Paused' | 'Archived'
  ): Promise<void> {

    if (!this.selected || this.saving) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.cdr.markForCheck();

    try {

      await this.api.changeStatus(
        this.selected.id,
        status
      );

      this.selected = null;

      await this.loadAds();

    } catch (error) {

      console.error(
        'Status update failed:',
        error
      );

      this.error =
        'Cannot update advertisement status.';

    } finally {

      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
