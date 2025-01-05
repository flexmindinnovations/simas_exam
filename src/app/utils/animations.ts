import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  stagger,
  keyframes,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          opacity: 0,
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-30px' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [animate('50ms ease-out', style({ opacity: 0, left: '100%' }))],
        {
          optional: true,
        }
      ),
      query(
        ':enter',
        [animate('600ms 100ms ease-in', style({ opacity: 1, left: '0%' }))],
        {
          optional: true,
        }
      ),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
]);

export const ScaleAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0) translateZ(0)' }),
    animate(
      '500ms ease-in-out',
      style({ opacity: 1, transform: 'scale(1) translateZ(0)' })
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'scale(1) translateZ(0)' }),
    animate(
      '500ms ease-in-out',
      style({ opacity: 0, transform: 'scale(0) translateZ(0)' })
    ),
  ]),
]);

export const FadeAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0)' }),
    animate('500ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'scale(1)' }),
    animate('500ms ease-in-out', style({ opacity: 0, transform: 'scale(0)' })),
  ]),
]);

export const RouterAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '97.7%', height: '100%', display: 'flex', 'align-items': 'flex-start', 'justify-content': 'flex-start', left: 0, opacity: 0 }), { optional: true }),
    group([
      query(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(0)' }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('600ms 100ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ], { optional: true })
    ])
  ])
])

export const BounceTextAnimation = trigger('bounce', [
  transition('* => *', [
    query('span', [
      animate(
        '2s infinite',
        keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-20px)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 1 }),
        ])
      ),
    ]),
  ]),
]);
