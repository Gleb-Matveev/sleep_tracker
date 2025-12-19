import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private getCommonViewData(extra: Record<string, unknown> = {}) {
    return {
      year: new Date().getFullYear(),
      ...extra,
    };
  }

  @Get()
  @Render('index')
  root() {
    return this.getCommonViewData({
      home: true,
      message: 'Track your sleep and wake up better every day 💤',
    });
  }

  @Get('projects')
  @Render('statistics')
  statistics() {
    const stats = [
      { date: '2025-12-17', score1: 8.2, score2: 7.5, description: 'Fell asleep quickly, woke up refreshed.' },
      { date: '2025-12-18', score1: 6.1, score2: 5.4, description: 'Late bedtime, some night awakenings.' },
    ];

    return this.getCommonViewData({
      stats: true,
      statistics: stats,
    });
  }

  @Get('hobbies')
  @Render('goals')
  goals() {
    const goals = [
      {
        title: 'Sleep 8 hours on weekdays',
        description: 'Lights out by 23:30 and wake up at 07:30, at least 5 days a week.',
      },
      {
        title: 'No screens 30 minutes before bed',
        description: 'Replace the phone with a book or calm music before sleep.',
      },
    ];

    return this.getCommonViewData({
      goals: true,
      items: goals,
    });
  }

  @Get('organisations')
  @Render('rules')
  rules() {
    const rules = [
      {
        title: 'Keep a stable sleep schedule',
        description: 'Go to bed and wake up at the same time, even on weekends.',
      },
      {
        title: 'Create a calm sleeping environment',
        description: 'Dark, cool room without loud noises or bright lights.',
      },
    ];

    return this.getCommonViewData({
      rules: true,
      items: rules,
    });
  }

  @Get('contacts')
  @Render('routins')
  routins() {
    const routins = [
      {
        name: 'Evening wind-down',
        type: 'night',
        points: [
          'Turn off bright lights 1 hour before bed',
          'Write down tasks for tomorrow',
          '10 minutes of stretching or light yoga',
        ],
      },
      {
        name: 'Morning energy boost',
        type: 'morning',
        points: [
          'Open curtains and get daylight immediately',
          'Drink a glass of water',
          '5 minutes of breathing or short walk',
        ],
      },
    ];

    return this.getCommonViewData({
      routins: true,
      items: routins,
    });
  }
}
