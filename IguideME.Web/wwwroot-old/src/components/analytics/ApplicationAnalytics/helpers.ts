export interface TreeNode {
  name: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

export const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export const data: TreeNode = {
  name: 'Start',
  children: [
    {
      name: "Home",
      children: [
        {
          name: "Quizzes",
          children: [
            {
              name: "Home",
              children: [
                { name: "Perusall" },
                { name: "Quizzes" }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Quizzes',
      children: [
        { name: 'Perusall' },
        { name: 'Attendance' },
        {
          name: 'C',
          children: [
            {
              name: 'C1',
            },
            {
              name: 'D',
              children: [
                {
                  name: 'D1',
                },
                {
                  name: 'D2',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Perusall',
      children: [
        { name: 'Attendance' },
        { name: 'B2' },
        { name: 'B3' }
      ],
    },
  ],
};
