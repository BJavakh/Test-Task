import {
  ComponentRef,
  Directive,
  HostListener,
  inject,
  input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../components/icon/icon.component';

@Directive({
  selector: '[spTooltip][message]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltip: message', 'matTooltipPosition: position']
    }
  ],
  providers: [
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: { position: 'above' },
    },
  ],
})
export class TooltipDirective implements OnInit {
  iconName = input<string>('info-circle-fill');

  private _setTimeoutIds: ReturnType<typeof setTimeout>[] = [];

  private _tooltip = inject(MatTooltip);
  private _viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    this._tooltip.tooltipClass = 'rp-tooltip';

    console.log('tooltip', this._tooltip);

    if (this._tooltip && !this._tooltip._isTooltipVisible()) {
      // setTimeout need to wait for tooltip to be created
      this._setTimeoutIds.push(
        setTimeout(() => {
          if (this.iconName()) {
            const iconComponent = this._creatIconComponent().location.nativeElement;
            const tooltip = this._tooltip._tooltipInstance._tooltip.nativeElement.querySelector(
              '.mat-mdc-tooltip-surface',
            );
            tooltip.insertBefore(iconComponent, tooltip.firstChild);

            // setting timeout to update position of tooltip after icon is added
            this._setTimeoutIds.push(
              setTimeout(() => {
                this._tooltip._overlayRef.updatePosition();
              }),
            );
          }
        }, this._tooltip.showDelay),
      );
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {

  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this._setTimeoutIds.forEach(clearTimeout);
    this._setTimeoutIds = [];
  }

  private _creatIconComponent(): ComponentRef<IconComponent> {
    const iconComponentInstance = this._viewContainerRef.createComponent(IconComponent);

    iconComponentInstance.setInput('iconName', this.iconName());
    iconComponentInstance.setInput('size', 'xs');

    return iconComponentInstance;
  }
}
