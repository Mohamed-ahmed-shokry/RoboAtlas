export type ContentLabel = 'Technical' | 'Build' | 'Application' | 'Discussion' | 'Career'
export type ResourceFormat = 'Video' | 'Playlist selection' | 'Reading' | 'Mixed resource'

export interface LearningUnit { id: string; title: string }
export interface Resource {
  id: string
  title: string
  creator: string
  url: string
  format: ResourceFormat
  label: ContentLabel
  selection?: string
  context?: string
  units: LearningUnit[]
}
export interface Stage {
  id: string
  title: string
  shortTitle: string
  learn: string
  enough: string
  resources: Resource[]
}

export const curriculum: Stage[] = [
  {
    id: 'robot-systems', title: 'How a complete robot works', shortTitle: 'The complete robot',
    learn: 'See how sensors, perception, state estimation, planning, control, and actuators work together.',
    enough: 'Explain the robot’s main components and how information and commands travel between them.',
    resources: [
      { id: 'ball-seeking-hoop', title: 'I made a ball seeking hoop', creator: 'Stuff Made Here', url: 'https://www.youtube.com/watch?v=xHWXZyfhQas', format: 'Video', label: 'Build', context: 'Start with a playful project connecting sensing, software, mechanisms, and movement.', units: [{ id: 'hoop-build', title: 'I made a ball seeking hoop' }] },
      { id: 'princeton-intro', title: 'Introduction to Robotics', creator: 'Princeton · Anirudha Majumdar', url: 'https://www.youtube.com/watch?v=cMhFAq53v1c', format: 'Video', label: 'Technical', selection: 'Watch Lecture 1 only.', units: [{ id: 'princeton-lecture-one', title: 'Introduction to Robotics, Lecture 1' }] },
      { id: 'ros-overview', title: 'ROS Overview', creator: 'Articulated Robotics', url: 'https://articulatedrobotics.xyz/tutorials/ready-for-ros/ros-overview/', format: 'Mixed resource', label: 'Technical', context: 'Video and explanation: nodes, topics, messages, services, and actions.', units: [{ id: 'ros-system-overview', title: 'ROS Overview' }] },
    ],
  },
  {
    id: 'hardware-embedded', title: 'Hardware and embedded foundations', shortTitle: 'Hardware & embedded',
    learn: 'Meet sensors, actuators, motors, power, control electronics, microcontrollers, and timing.',
    enough: 'Explain the path from a sensor measurement to a motor command, including the electronics and timing involved.',
    resources: [
      { id: 'begin-robotics', title: 'Begin Robotics', creator: 'University of Reading · FutureLearn', url: 'https://www.futurelearn.com/courses/begin-robotics', format: 'Mixed resource', label: 'Technical', selection: 'Week 2, “Robot anatomy,” including its simulations. The full course is not assigned.', context: 'Access may require registration. Access terms can change.', units: [{ id: 'robot-anatomy-week-two', title: 'Week 2: Robot anatomy and simulations' }] },
      { id: 'rtos-intro', title: 'Introduction to RTOS, Part 1', creator: 'DigiKey', url: 'https://www.digikey.com/en/videos/d/digi-key-electronics/introduction-to-rtos-part-1-what-is-a-real-time-operating-system-rtos', format: 'Video', label: 'Technical', selection: 'Watch “What Is a Real-Time Operating System?” only.', units: [{ id: 'what-is-rtos', title: 'What Is a Real-Time Operating System?' }] },
      { id: 'robot-dog-build', title: 'Robot Dog V3: 3D Printed & Open Source #1', creator: 'James Bruton', url: 'https://www.youtube.com/watch?v=yXA_KeuYpCY', format: 'Video', label: 'Build', context: 'Explore how component and mechanical choices affect a robot.', units: [{ id: 'robot-dog-v3-one', title: 'Robot Dog V3: 3D Printed & Open Source #1' }] },
    ],
  },
  {
    id: 'geometry-kinematics', title: 'Geometry and kinematics', shortTitle: 'Geometry & kinematics',
    learn: 'Connect coordinate frames, position, orientation, transformations, degrees of freedom, workspace, and forward/inverse kinematics.',
    enough: 'Follow a simple coordinate transformation, distinguish forward/inverse kinematics, and explain how a camera-relative position becomes a robot-relative target.',
    resources: [
      { id: 'modern-robotics-ch2', title: 'Modern Robotics · Chapter 2', creator: 'Northwestern University', url: 'https://modernrobotics.northwestern.edu/nu-gm-book-resource/chapter-2-playlist/', format: 'Playlist selection', label: 'Technical', selection: 'Watch only lessons 2.1, 2.2, and 2.5.', units: [
        { id: 'rigid-body-dof', title: '2.1: Degrees of Freedom of a Rigid Body' },
        { id: 'robot-dof', title: '2.2: Degrees of Freedom of a Robot' },
        { id: 'task-space-workspace', title: '2.5: Task Space and Workspace' },
      ] },
      { id: 'modern-robotics-ch3', title: 'Modern Robotics · Chapter 3', creator: 'Northwestern University', url: 'https://modernrobotics.northwestern.edu/chapters/chapter3/', format: 'Playlist selection', label: 'Technical', selection: 'Watch only the four lessons listed below.', units: [
        { id: 'rigid-body-motions', title: 'Introduction to Rigid-Body Motions' },
        { id: 'rotation-matrices-one', title: 'Rotation Matrices, Part 1' },
        { id: 'rotation-matrices-two', title: 'Rotation Matrices, Part 2' },
        { id: 'homogeneous-transformations', title: 'Homogeneous Transformation Matrices' },
      ] },
      { id: 'manipulator-algorithms', title: 'Designing Robot Manipulator Algorithms', creator: 'MathWorks', url: 'https://www.mathworks.com/videos/matlab-and-simulink-robotics-arena-designing-robot-manipulator-algorithms-1515776491590.html', format: 'Video', label: 'Technical', context: 'Focus on ideas and demonstrations. Reproducing the software steps is optional.', units: [{ id: 'designing-manipulators', title: 'Designing Robot Manipulator Algorithms' }] },
      { id: 'opendog-walk', title: 'openDog V3: How I made it Walk', creator: 'James Bruton', url: 'https://www.youtube.com/watch?v=eKZIJwJBjEs', format: 'Video', label: 'Build', units: [{ id: 'opendog-v3-walking', title: 'openDog V3: How I made it Walk' }] },
    ],
  },
  {
    id: 'dynamics-control', title: 'Dynamics and feedback control', shortTitle: 'Dynamics & control',
    learn: 'Understand physical movement, feedback, PID, disturbances, sensor noise, and actuator limits.',
    enough: 'Explain feedback, overshoot, noise, saturation, and the difference between planning a movement and controlling it.',
    resources: [
      { id: 'pid-control', title: 'Understanding PID Control', creator: 'Brian Douglas / MathWorks', url: 'https://www.youtube.com/playlist?list=PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y', format: 'Playlist selection', label: 'Technical', selection: 'Watch Parts 1, 2, 3, 4, and 7 only.', units: [
        { id: 'pid-part-one', title: 'Understanding PID Control · Part 1' },
        { id: 'pid-part-two', title: 'Understanding PID Control · Part 2' },
        { id: 'pid-part-three', title: 'Understanding PID Control · Part 3' },
        { id: 'pid-part-four', title: 'Understanding PID Control · Part 4' },
        { id: 'pid-part-seven', title: 'Understanding PID Control · Part 7' },
      ] },
      { id: 'drone-control', title: 'Drone Simulation and Control', creator: 'MathWorks', url: 'https://www.mathworks.com/videos/series/drone-simulation-and-control.html', format: 'Playlist selection', label: 'Technical', selection: 'Watch only these two lessons.', units: [
        { id: 'drone-control-problem', title: 'Setting Up the Control Problem' },
        { id: 'drone-hover', title: 'How Do You Get a Drone to Hover?' },
      ] },
      { id: 'balancing-bike', title: 'Omni-Wheel Balancing Robot Bike', creator: 'James Bruton · Arduino', url: 'https://blog.arduino.cc/2022/02/26/james-brutons-strange-bicycle-robot-self-balances-with-an-omni-wheel/', format: 'Mixed resource', label: 'Build', context: 'Embedded video and article about an unusual self-balancing robot.', units: [{ id: 'omni-wheel-bike', title: 'Omni-Wheel Balancing Robot Bike' }] },
    ],
  },
  {
    id: 'robot-perception', title: 'Perception for robotics', shortTitle: 'Robot perception',
    learn: 'Turn camera calibration, depth, point clouds, and alignment into spatial information a robot can act on.',
    enough: 'Explain what a robot needs beyond an object’s bounding box and how calibration errors affect physical behavior.',
    resources: [
      { id: 'five-minutes-cyrill', title: '5 Minutes with Cyrill', creator: 'Cyrill Stachniss · University of Bonn', url: 'https://www.ipb.uni-bonn.de/5min/index.html', format: 'Playlist selection', label: 'Technical', selection: 'Watch only these four selected videos.', units: [
        { id: 'camera-intrinsics-extrinsics', title: 'Camera Intrinsics and Extrinsics' },
        { id: 'intrinsic-calibration', title: 'Intrinsic Camera Calibration' },
        { id: 'stereo-depth', title: '3D from Stereo' },
        { id: 'iterative-closest-point', title: 'Iterative Closest Point' },
      ] },
      { id: 'robots-see', title: 'Making Vehicles and Robots See', creator: 'MathWorks', url: 'https://www.mathworks.com/videos/series/making-vehicles-and-robots-see-getting-started-with-perception-for-students.html', format: 'Video', label: 'Technical', selection: 'Watch “Basics of Point-Cloud Processing” only.', units: [{ id: 'point-cloud-basics', title: 'Basics of Point-Cloud Processing' }] },
      { id: 'meet-ethan', title: 'Ask a Roboticist: Meet Ethan', creator: 'Boston Dynamics', url: 'https://bostondynamics.com/blog/ask-a-roboticist-meet-ethan/', format: 'Mixed resource', label: 'Career', context: 'Interview video and text: see how a perception engineer uses these ideas.', units: [{ id: 'ethan-perception-career', title: 'Ask a Roboticist: Meet Ethan' }] },
    ],
  },
  {
    id: 'estimation-slam', title: 'State estimation, sensor fusion, and SLAM', shortTitle: 'Estimation, fusion & SLAM',
    learn: 'Explore position and movement estimation, uncertainty, drift, localization, mapping, and SLAM.',
    enough: 'Explain drift, uncertainty, particle-filter intuition, sensor fusion, and the distinctions between localization, mapping, and SLAM.',
    resources: [
      { id: 'sensor-fusion', title: 'Understanding Sensor Fusion and Tracking', creator: 'MathWorks', url: 'https://www.mathworks.com/videos/series/understanding-sensor-fusion-and-tracking.html', format: 'Playlist selection', label: 'Technical', selection: 'Watch Parts 1, 2, and 3 only.', units: [
        { id: 'fusion-introduction', title: 'Part 1: What Is Sensor Fusion?' },
        { id: 'fusion-orientation', title: 'Part 2: Fusing a Mag, Accel, and Gyro to Estimate Orientation' },
        { id: 'fusion-pose', title: 'Part 3: Fusing a GPS and IMU to Estimate Pose' },
      ] },
      { id: 'navigation-estimation', title: 'Autonomous Navigation', creator: 'Brian Douglas / MathWorks', url: 'https://www.youtube.com/playlist?list=PLn8PRpmsu08rLRGrnF-S6TyGrmcA2X7kg', format: 'Playlist selection', label: 'Technical', selection: 'Watch Parts 1, 2, and 3. Parts 4 and 6 appear in Stage 7.', units: [
        { id: 'navigation-introduction', title: 'Part 1: What Is Autonomous Navigation?' },
        { id: 'navigation-particle-filter', title: 'Part 2: Understanding the Particle Filter' },
        { id: 'navigation-pose-graph-slam', title: 'Part 3: Understanding SLAM Using Pose Graph Optimization' },
      ] },
      { id: 'mars-helicopter', title: 'How this helicopter survived 1004 days on Mars…', creator: 'Veritasium', url: 'https://www.youtube.com/watch?v=20vUNgRdB4o', format: 'Video', label: 'Application', context: 'Explore the engineering constraints of a real autonomous mission.', units: [{ id: 'ingenuity-mars-mission', title: 'How this helicopter survived 1004 days on Mars…' }] },
    ],
  },
  {
    id: 'planning-applications', title: 'Planning and real-world applications', shortTitle: 'Planning & applications',
    learn: 'Connect paths, trajectories, autonomous behavior, and planning methods to useful outcomes.',
    enough: 'Distinguish behavior, path, timed trajectory, and control, and explain how the operating environment changes the engineering problem.',
    resources: [
      { id: 'navigation-planning', title: 'Autonomous Navigation', creator: 'Brian Douglas / MathWorks', url: 'https://www.youtube.com/playlist?list=PLn8PRpmsu08rLRGrnF-S6TyGrmcA2X7kg', format: 'Playlist selection', label: 'Technical', selection: 'Watch Parts 4 and 6 only. These are different from the Stage 6 lessons.', units: [
        { id: 'navigation-path-planning', title: 'Part 4: Path Planning with A* and RRT' },
        { id: 'navigation-assessment', title: 'Part 6: Metrics for System Assessment' },
      ] },
      { id: 'trajectory-planning', title: 'Trajectory Planning for Robot Manipulators', creator: 'MathWorks', url: 'https://www.mathworks.com/videos/trajectory-planning-for-robot-manipulators-1556705635398.html', format: 'Video', label: 'Technical', units: [{ id: 'manipulator-trajectories', title: 'Trajectory Planning for Robot Manipulators' }] },
      { id: 'stretch-dhl', title: 'Stretch at DHL', creator: 'Boston Dynamics / DHL', url: 'https://bostondynamics.com/case-studies/stretch-at-dhl/', format: 'Mixed resource', label: 'Application', context: 'Case-study video and text. A company/customer perspective on deployment.', units: [{ id: 'stretch-warehouse', title: 'Stretch at DHL' }] },
      { id: 'agri-robotics', title: 'How agri-robotics will change the food you eat', creator: 'Katherine James · TED', url: 'https://www.ted.com/talks/katherine_james_how_agri_robotics_will_change_the_food_you_eat', format: 'Video', label: 'Application', context: 'A talk on robotics in agriculture.', units: [{ id: 'agriculture-applications', title: 'How agri-robotics will change the food you eat' }] },
    ],
  },
  {
    id: 'robot-learning', title: 'Robot learning and model training', shortTitle: 'Robot learning',
    learn: 'Work through policies, rewards, demonstrations, observations/actions, rollouts, data collection, training, and physical evaluation.',
    enough: 'Distinguish RL and imitation learning, explain a policy rollout, and describe why low training loss alone does not establish successful robot behavior.',
    resources: [
      { id: 'reinforcement-foundations', title: 'Reinforcement Learning', creator: 'Brian Douglas / MathWorks', url: 'https://www.youtube.com/playlist?list=PLn8PRpmsu08qw_IwpgVNsKiJQpvvW0MmM', format: 'Playlist selection', label: 'Technical', selection: 'Watch Parts 1–5 only. Track each part separately.', units: [
        { id: 'rl-part-one', title: 'Reinforcement Learning · Part 1' },
        { id: 'rl-part-two', title: 'Reinforcement Learning · Part 2' },
        { id: 'rl-part-three', title: 'Reinforcement Learning · Part 3' },
        { id: 'rl-part-four', title: 'Reinforcement Learning · Part 4' },
        { id: 'rl-part-five', title: 'Reinforcement Learning · Part 5' },
      ] },
      { id: 'lerobot-act', title: 'LeRobot ACT tutorial', creator: 'Hugging Face', url: 'https://www.youtube.com/watch?v=ft73x0LfGpM', format: 'Video', label: 'Technical', context: 'Learn action sequences from demonstrations.', units: [{ id: 'act-demonstrations', title: 'LeRobot ACT tutorial' }] },
      { id: 'imitation-real-robots', title: 'Imitation Learning on Real-World Robots', creator: 'Hugging Face', url: 'https://huggingface.co/docs/lerobot/il_robots', format: 'Reading', label: 'Technical', context: 'Follow demonstration collection, training, and evaluation. Running commands is optional.', units: [{ id: 'imitation-workflow', title: 'Imitation Learning on Real-World Robots' }] },
      { id: 'atlas-learning', title: 'How does Atlas learn?', creator: 'Boston Dynamics', url: 'https://bostondynamics.com/video/how-does-atlas-learn-inside-the-lab/', format: 'Video', label: 'Application', units: [{ id: 'atlas-inside-lab', title: 'How does Atlas learn?' }] },
    ],
  },
  {
    id: 'physical-ai', title: 'Physical AI, world models, and sim-to-real', shortTitle: 'Physical AI & sim-to-real',
    learn: 'Connect perception, prediction, reasoning, learned actions, simulation, and physical controllers.',
    enough: 'Distinguish a policy, a learned world model, and a physics simulator; explain sim-to-real failures and how learned outputs connect to physical controllers.',
    resources: [
      { id: 'physical-ai-intro', title: 'What Is Physical AI?', creator: 'NVIDIA', url: 'https://www.nvidia.com/en-us/glossary/generative-physical-ai/', format: 'Reading', label: 'Technical', selection: 'Read the introduction and development cycle.', units: [{ id: 'physical-ai-development', title: 'What Is Physical AI?' }] },
      { id: 'reinforcement-hardware', title: 'Reinforcement Learning · Models & hardware', creator: 'Brian Douglas / MathWorks', url: 'https://www.mathworks.com/videos/series/reinforcement-learning.html', format: 'Playlist selection', label: 'Technical', selection: 'Watch only these two lessons.', units: [
        { id: 'model-based-rl', title: 'Why Choose Model-Based Reinforcement Learning?' },
        { id: 'rl-on-hardware', title: 'Reinforcement Learning on Hardware' },
      ] },
      { id: 'gemini-robotics', title: 'Gemini Robotics', creator: 'Google DeepMind', url: 'https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/', format: 'Mixed resource', label: 'Application', selection: 'Read the introduction and watch the overview demonstration (one combined unit).', context: 'An example of vision-language-action models and embodied reasoning.', units: [{ id: 'gemini-intro-demo', title: 'Gemini Robotics: introduction and overview demonstration' }] },
      { id: 'world-models', title: 'What Is a World Model?', creator: 'NVIDIA', url: 'https://www.nvidia.com/en-us/glossary/world-models/', format: 'Reading', label: 'Technical', context: 'Focus on predicting outcomes and uses in planning or simulation.', units: [{ id: 'world-model-introduction', title: 'What Is a World Model?' }] },
      { id: 'jim-fan-challenge', title: 'The next grand challenge for AI', creator: 'Jim Fan · TED', url: 'https://www.ted.com/talks/jim_fan_the_next_grand_challenge_for_ai', format: 'Video', label: 'Discussion', context: 'A 2023 conceptual perspective on embodied AI.', units: [{ id: 'embodied-ai-challenge', title: 'The next grand challenge for AI' }] },
    ],
  },
  {
    id: 'explore-directions', title: 'Explore specializations, careers, and broader challenges', shortTitle: 'Explore your directions',
    learn: 'See how different platforms combine the foundations, meet the engineering work, and discover what interests you.',
    enough: 'Compare the work involved in different systems and identify two practical experiments you would like to try next.',
    resources: [
      { id: 'perceptive-locomotion', title: 'Learning Robust Perceptive Locomotion', creator: 'ETH Zürich · Robotic Systems Lab', url: 'https://leggedrobotics.github.io/rl-perceptiveloco/', format: 'Mixed resource', label: 'Application', context: 'Walking robots: research demonstration and project overview. Full paper and code reproduction are optional.', units: [{ id: 'legged-locomotion-demo', title: 'Learning Robust Perceptive Locomotion' }] },
      { id: 'agile-autonomy', title: 'Learning High-Speed Flight in the Wild', creator: 'University of Zürich · Robotics and Perception Group', url: 'https://rpg.ifi.uzh.ch/AgileAutonomy.html', format: 'Mixed resource', label: 'Application', context: 'Autonomous drones: research demonstration and project overview.', units: [{ id: 'high-speed-flight-demo', title: 'Learning High-Speed Flight in the Wild' }] },
      { id: 'aloha', title: 'ALOHA', creator: 'Tony Zhao and collaborators · Stanford', url: 'https://tonyzhaozh.github.io/aloha/', format: 'Mixed resource', label: 'Application', context: 'Manipulation and imitation learning: research demonstrations, including successful and failed examples.', units: [{ id: 'aloha-manipulation-demo', title: 'ALOHA' }] },
      { id: 'meet-tom', title: 'Ask a Roboticist: Meet Tom', creator: 'Boston Dynamics', url: 'https://bostondynamics.com/video/ask-a-roboticist-meet-tom/', format: 'Video', label: 'Career', context: 'An interview about robotics software engineering.', units: [{ id: 'tom-software-career', title: 'Ask a Roboticist: Meet Tom' }] },
      { id: 'better-robots', title: 'Why don’t we have better robots yet?', creator: 'Ken Goldberg · TED', url: 'https://www.ted.com/talks/ken_goldberg_why_don_t_we_have_better_robots_yet', format: 'Video', label: 'Discussion', units: [{ id: 'goldberg-robot-challenges', title: 'Why don’t we have better robots yet?' }] },
    ],
  },
]

export const learningUnits = curriculum.flatMap((stage, stageIndex) =>
  stage.resources.flatMap(resource => resource.units.map(unit => ({ stage, stageNumber: stageIndex + 1, resource, unit }))),
)
export const unitIds = new Set(learningUnits.map(item => item.unit.id))
export const stageIds = new Set(curriculum.map(stage => stage.id))
