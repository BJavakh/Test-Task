import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  readonly iconName = input();
}
