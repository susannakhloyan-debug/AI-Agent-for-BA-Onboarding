'use strict';

/**
 * Builds the structured content for a BA Onboarding Plan, following the
 * team's exercise-based onboarding curriculum: a fixed sequence of
 * hands-on modules (negotiation simulation, requirements docs, process
 * modeling, wireframing, SQL, feature ideation) applied to whatever
 * product/topic the BA is assigned.
 */

const ROLE_LABELS = {
  new_ba: 'New Business Analyst',
  intern: 'Business Analyst Intern',
};

const DEFAULT_SQL_RESOURCES = [
  { text: 'SQL fundamentals reading (Habr): https://habr.com/ru/post/480838/', url: 'https://habr.com/ru/post/480838/' },
  { text: 'Online SQL simulator (W3Schools "Try SQL"): https://www.w3schools.com/sql/trysql.asp?filename=trysql_op_in', url: 'https://www.w3schools.com/sql/trysql.asp?filename=trysql_op_in' },
  { text: 'Table relationships article (Habr): https://habr.com/ru/post/488054/', url: 'https://habr.com/ru/post/488054/' },
  { text: 'Codecademy — Learn SQL, Queries lesson: https://www.codecademy.com/courses/learn-sql/lessons/queries/exercises/queries', url: 'https://www.codecademy.com/courses/learn-sql/lessons/queries/exercises/queries' },
  { text: 'StrataScratch — SQL practice with real company cases: https://platform.stratascratch.com/coding?code_type=3', url: 'https://platform.stratascratch.com/coding?code_type=3' },
  { text: 'SQL-Tutorial.ru (with exercises at sql-ex.ru): http://www.sql-tutorial.ru/en', url: 'http://www.sql-tutorial.ru/en' },
];

const DEFAULT_SQL_TASKS = [
  'Write a query to select all columns from the employees table.',
  'Select only the first_name, last_name, and salary columns from the employees table.',
  'Select employees who earn more than $80,000. Display their name and salary.',
  'Select all unique department IDs from the employees table.',
  'Select all employees ordered by salary in descending order.',
  'Select the top 3 highest paid employees.',
  "Select first_name as 'First Name' and last_name as 'Last Name' from employees.",
  'Calculate annual salary by multiplying monthly salary by 12. Assume current salary is monthly.',
  'Select employee names in uppercase format.',
  'Select employees where salary is between 60000 and 90000 AND department_id is 10.',
];

function buildPlan({
  baName,
  role = 'new_ba',
  topic,
  productName,
  subProcessTopic,
  mentor,
  durationMonths = 3,
  evaluationFrequency = 'Weekly check-ins + Project assessment',
  startDate,
  generatedDate,
  sqlResources = DEFAULT_SQL_RESOURCES,
  sqlTasks = DEFAULT_SQL_TASKS,
  sqlAccessNote = 'Practice environment / dataset access to be provided by the mentor.',
  sqlAccessSource = { text: 'https://www.sql-practice.online/scenario/select-statements', url: 'https://www.sql-practice.online/scenario/select-statements' },
  prdTemplateName = 'Product Requirement Document_template',
  prdTemplateLink,
}) {
  if (!baName) throw new Error('baName is required');
  if (!topic) throw new Error('topic is required');
  if (!mentor) throw new Error('mentor is required');
  if (!ROLE_LABELS[role]) {
    throw new Error(`role must be one of: ${Object.keys(ROLE_LABELS).join(', ')}`);
  }

  const product = productName || 'the product';
  const subProcess = subProcessTopic || `a core workflow within ${topic}`;
  const isIntern = role === 'intern';
  const totalMonths = Math.max(1, Math.round(durationMonths));

  const meta = {
    baName,
    role,
    roleLabel: ROLE_LABELS[role],
    topic,
    productName: product,
    mentor,
    durationMonths: totalMonths,
    evaluationFrequency,
    startDate: startDate || 'TBD',
    generatedDate: generatedDate || new Date().toISOString().slice(0, 10),
    goal: `Strengthen the ${isIntern ? 'intern' : 'Business Analyst'}'s foundational BA knowledge, enhance confidence in requirements elicitation and documentation, and provide hands-on experience in a real project environment focused on ${topic}.`,
  };

  const sections = [
    {
      id: 1,
      title: 'Requirement Gathering and Negotiation Session — Imitation',
      parts: [
        {
          heading: 'Background',
          paragraphs: [
            `You are a ${isIntern ? 'new BA intern' : 'new Business Analyst'} given a task (simulation): a requirement gathering and negotiation session for a feature request, "${topic}", in ${product}.`,
            "Your goal is to gather detailed requirements and negotiate the scope with a simulated client (the mentor). Before the interview, prepare interview questions, suggestions, clarifications, and any information that will help you understand and document the client's needs.",
          ],
        },
        {
          heading: 'Scenario',
          paragraphs: [
            `As a Business Analyst, you are assigned to conduct a discovery phase for "${topic}" within ${product}. Your task is to gather and clarify requirements by engaging stakeholders, understanding the different user types affected, defining scope and constraints, and documenting how the feature should behave within the system to support business needs.`,
          ],
        },
        {
          heading: 'Task',
          bullets: [
            `Prepare interview questions: develop a set of interview questions that will help you uncover the client's specific needs and expectations regarding "${topic}".`,
            'Your suggestions and clarifications.',
            'Information gathering.',
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Requirements Analysis and Documentation',
      parts: [
        {
          paragraphs: [
            `Analyze the gathered requirements and document them as an Epic -> User Story decomposition, and document a PRD covering the Epic scope for "${topic}".`,
            '(Using predefined template)',
          ],
          linkLine: prdTemplateLink
            ? { text: prdTemplateName, url: prdTemplateLink }
            : { text: prdTemplateName },
        },
      ],
    },
    {
      id: 3,
      title: 'Split the Scope into 3 Stages (MVP + Priorities)',
      parts: [
        {
          paragraphs: [
            `Split the scope defined in section 2 into 3 delivery stages, starting with an MVP, and assign a priority to each stage/requirement.`,
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Process Modeling Skills',
      parts: [
        {
          paragraphs: [
            `Create a flowchart / BPMN diagram for ${subProcess}. You can use draw.io or Camunda.`,
          ],
          bullets: [
            'Utilize draw.io (e.g. the Confluence built-in plugin) or Camunda to create the process model.',
            'Visualize the step-by-step process of how users will interact with the feature.',
            'Include key actions, decision points, data flows, and system interactions in the diagram.',
            "Ensure the process model serves as a reference for the development team and stakeholders to understand the feature's workflow and logic.",
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Create a Wireframe of the Feature',
      parts: [
        {
          paragraphs: [`Use Figma or Miro (free account) to create a high-level wireframe for "${topic}".`],
        },
      ],
    },
    {
      id: 6,
      title: 'Present to the Mentor (Imitating a Grooming Session)',
      parts: [
        {
          paragraphs: [
            'Present the Epic and User Stories, with their detailed list of Acceptance Criteria, and the process flow diagram, to support better understanding.',
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'SQL',
      parts: [
        {
          heading: 'Important Links and References to Learn SQL',
          links: sqlResources,
        },
        {
          heading: 'Access to SQL',
          paragraphs: [sqlAccessNote],
          links: [sqlAccessSource],
        },
        {
          heading: 'Tasks',
          sqlTable: sqlTasks,
        },
      ],
    },
    {
      id: 8,
      title: `Think of New Features / Improvements for ${product}`,
      parts: [
        {
          paragraphs: [
            `Think of new features or improvements related to ${topic} (the exact scope is subject to agreement with the mentor).`,
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'Proposing an Alternative Solution for Section 1',
      parts: [
        {
          paragraphs: [
            `Propose an alternative solution/approach to the "${topic}" feature analyzed in Section 1, with reasoning for the trade-offs against the original approach.`,
          ],
        },
      ],
    },
  ];

  return { meta, sections };
}

module.exports = { buildPlan, ROLE_LABELS, DEFAULT_SQL_RESOURCES, DEFAULT_SQL_TASKS };
