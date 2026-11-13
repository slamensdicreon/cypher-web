/** The product's screens, as the site shows them: real Cypher screens from a demo project. */
export type Shot = { src: string; w: number; h: number; alt: string; label: string };

export const SHOTS = {
  everything: { src: '/product/everything.jpg', w: 2000, h: 1411, label: 'Mission control', alt: 'Cypher’s mission control: the phases from intake to UAT with their gates, components registered, cost against budget, what needs you, running tasks and the team.' },
  bliss: { src: '/product/bliss.jpg', w: 2000, h: 1032, label: 'Bliss', alt: 'Cypher in Bliss: one sentence on where the project stands, and a decision card with Cypher’s pick, a deadline and what happens if you say nothing.' },
  needs: { src: '/product/needs.jpg', w: 2000, h: 1064, label: 'Bliss', alt: 'Cypher in Bliss mid-build: components has just started, two things are yours, and a decision card on hero component granularity.' },
  decisions: { src: '/product/decisions.jpg', w: 2000, h: 517, label: 'Needs you', alt: 'The Needs you list: a decision and a risk, each with its owner, its deadline and what happens next.' },
  plan: { src: '/product/plan.jpg', w: 1476, h: 1460, label: 'The plan', alt: 'The engagement plan by phase: intake, discovery, blueprint and foundation done, each activity with the specialist who ran it.' },
  workbench: { src: '/product/workbench.jpg', w: 2000, h: 1544, label: 'Workbench', alt: 'The workbench: the approved Implementation Blueprint, the plan of record, with the component inventory, platform notes and page inventory beside it.' },
  team: { src: '/product/team.jpg', w: 2000, h: 1379, label: 'The team', alt: 'The team of twenty-one: Cypher as chief of staff, and discovery and engineering leads with their specialists, who is working and on what.' },
  activity: { src: '/product/activity.jpg', w: 2000, h: 1411, label: 'Activity', alt: 'The activity log: every action with who did it, the tool, what happened, the result, how long it took and the tokens it used.' },
  tasks: { src: '/product/tasks.jpg', w: 2000, h: 1405, label: 'Activities', alt: 'Every activity in the engagement with its phase, owner, start, finish and state.' },
  scorecard: { src: '/product/scorecard.jpg', w: 2000, h: 1500, label: 'Scorecard', alt: 'The scorecard: cost per task, decisions settled without you, recommendations taken, and every phase’s tasks, cards, reviews and spend.' },
  next: { src: '/product/next.jpg', w: 1720, h: 900, label: 'What happens next', alt: 'What happens next: the upcoming tasks in order, each with its specialist and what it waits on.' },
} as const satisfies Record<string, Shot>;

export type ShotKey = keyof typeof SHOTS;

/** The phases of a build, in order, with the gates where you approve. */
export const PHASES = [
  { name: 'Intake', gate: false },
  { name: 'Discovery', gate: false },
  { name: 'Blueprint', gate: true },
  { name: 'Foundation', gate: false },
  { name: 'Components', gate: false },
  { name: 'Templates', gate: false },
  { name: 'Migration', gate: false },
  { name: 'Experience', gate: false },
  { name: 'Deployment', gate: false },
  { name: 'UAT', gate: true },
] as const;
