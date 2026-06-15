// AllScale Org chart — initial data
// Persisted to localStorage; this file is the initial seed only.

window.ORG_SEED = {
  // Board sits above the org as a separate group (rendered as a strip)
  board: {
    id: "board",
    title: "Board of Directors",
    members: [
      { id: "p_shawn_b",   name: "Shunxin (Shawn) Pang", role: "Board member" },
      { id: "p_leo_b",     name: "Ruoyang (Leo) Wang",   role: "Board member" },
      { id: "p_alisha_b",  name: "Jun (Alisha) Li",      role: "Board member" },
    ],
  },

  // Executive row — these are the chart roots. Each has departments under them.
  executives: [
    {
      id: "e_ceo",
      name: "Shunxin (Shawn) Pang",
      title: "CEO",
      personId: "p_shawn",
      tag: "Direct report — Board",
      departments: [
        {
          id: "d_bd",
          name: "Business Development",
          subtitle: "Shawn — NA · Alisha — APAC",
          note: "Coordinates with Marketing",
          members: [],
        },
        {
          id: "d_design",
          name: "Design",
          subtitle: "Reports to CEO",
          members: [
            { id: "p_jony", name: "Jony Ren",  role: "UI/UX Designer" },
          ],
        },
      ],
    },
    {
      id: "e_coo",
      name: "Ruoyang (Leo) Wang",
      title: "COO",
      personId: "p_leo",
      tag: "Operations & Market",
      departments: [
        {
          id: "d_marketing",
          name: "Marketing & Sales",
          subtitle: "Reports to COO",
          members: [
            { id: "p_alex",   name: "Alex Chen", role: "Marketing Lead", level: "lead" },
            { id: "p_min",    name: "Min Shu",   role: "Ecosystem Lead", level: "lead" },
            { id: "p_open_m", name: "Job opening", role: "Marketing Ambassador & BD", level: "lead", openRole: true },
            { id: "p_george", name: "George Lin",   role: "Community Manager" },
            { id: "p_evelyn", name: "Evelyn Cheng", role: "Sales & Account Manager" },
            { id: "p_howe",   name: "Howe Wei",     role: "BD Manager — Shenzhen & Hong Kong" },
          ],
        },
        {
          id: "d_ops",
          name: "Operation & HR",
          subtitle: "Reports to COO",
          members: [],
        },
      ],
    },
    {
      id: "e_fund",
      name: "Jun (Alisha) Li",
      title: "Fundraising Master",
      personId: "p_alisha",
      tag: "Capital",
      departments: [
        {
          id: "d_fundraising",
          name: "Fundraising",
          subtitle: "Reports to Alisha",
          members: [
            { id: "p_steven", name: "Steven Cen",  role: "BD Manager — Shanghai" },
            { id: "p_thomas", name: "Thomas Zheng", role: "FA" },
          ],
        },
      ],
    },
    {
      id: "e_cto",
      name: "Jianfei (Tom) Chen",
      title: "CTO",
      personId: "p_tom",
      tag: "Engineering",
      departments: [
        {
          id: "d_product",
          name: "Product",
          subtitle: "Reports to CTO",
          members: [],
        },
        {
          id: "d_dev",
          name: "Development",
          subtitle: "Reports to CTO",
          members: [
            { id: "p_xi",       name: "Xi Weng",          role: "System Development Engineer", level: "lead" },
            { id: "p_kaishuai", name: "Kaishuai Wang",    role: "System Development Engineer", level: "lead" },
            { id: "p_yao",      name: "Yao Wang",         role: "Product Manager",             level: "lead" },
            { id: "p_reini",    name: "Reini (Yuxin) Zhou", role: "Intern",                    level: "lead" },
            { id: "p_peiran",   name: "Peiran Xu",        role: "Quality Engineer" },
            { id: "p_wayne",    name: "Wayne Wang",       role: "System Development Engineer" },
            { id: "p_zihao",    name: "Zihao Huang",      role: "Quality Engineer" },
            { id: "p_jiamin",   name: "Jiamin Ning",      role: "System Development Engineer" },
            { id: "p_echo",     name: "Echo (Mengya) Zeng", role: "Quality Engineer" },
          ],
        },
      ],
    },
    {
      id: "e_legal",
      name: "Khalil Lin",
      title: "General Counsel / Product Owner",
      personId: "p_khalil",
      tag: "Legal",
      departments: [
        {
          id: "d_compliance",
          name: "Compliance & Legal",
          subtitle: "Reports to Khalil",
          members: [],
        },
      ],
    },
  ],
};
