import { curriculum as legacyCurriculum } from "./curriculum";
import type { ContentLabel } from "./curriculum";

export interface LearningResource {
  id: string;
  title: string;
  creator: string;
  url: string;
  label: ContentLabel;
  scope?: string;
}

export interface LearningSection {
  id: string;
  title: string;
  resources: LearningResource[];
  scope?: string;
  task?: string;
  legacyUnitIds?: string[];
}

export interface RoadmapStage {
  id: string;
  title: string;
  shortTitle: string;
  topicGroupId: string;
  sections: LearningSection[];
}

export const topicGroupIds = [
  "complete-systems",
  "hardware-embedded",
  "feedback-control",
  "geometry-kinematics",
  "ros-simulation",
  "perception",
  "estimation-slam",
  "planning-autonomy",
  "manipulation",
  "imitation-learning",
  "reinforcement-learning",
  "drones-legged",
  "physical-ai",
] as const;

function resource(
  id: string,
  title: string,
  creator: string,
  url: string,
  label: ContentLabel = "Technical",
): LearningResource {
  return { id, title, creator, url, label };
}

// Canonical metadata is reused across distinct assigned scopes; section IDs never derive from positions.
const sources = {
  princeton: resource(
    "princeton-intro",
    "Introduction to Robotics, Lecture 1",
    "Princeton · Anirudha Majumdar",
    "https://www.youtube.com/watch?v=cMhFAq53v1c",
  ),
  princetonCourse: resource(
    "princeton-course",
    "Introduction to Robotics: course reference",
    "Princeton · iRoM Lab",
    "https://irom-lab.princeton.edu/intro-to-robotics/",
  ),
  mobileOverview: resource(
    "mobile-overview",
    "Making a Mobile Robot: Project Overview",
    "Articulated Robotics",
    "https://www.youtube.com/watch?v=OWeLUSzxMsw",
    "Build",
  ),
  mobileCompanion: resource(
    "mobile-overview-companion",
    "Project Overview",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/project-overview/",
    "Build",
  ),
  hoop: resource(
    "ball-seeking-hoop",
    "I Made a Ball Seeking Hoop",
    "Stuff Made Here",
    "https://www.youtube.com/watch?v=xHWXZyfhQas",
    "Build",
  ),
  motors: resource(
    "motors-guide",
    "The Ultimate Guide to Using Motors in Robotics",
    "Articulated Robotics",
    "https://www.youtube.com/watch?v=-PCuDnpgiew",
  ),
  power: resource(
    "power-concepts",
    "Power Concepts",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/hardware/power-theory/",
  ),
  rtos: resource(
    "rtos-intro",
    "Introduction to RTOS, Part 1",
    "Shawn Hymel · DigiKey",
    "https://www.youtube.com/watch?v=F321087yYy4",
  ),
  rtosReference: resource(
    "rtos-reference",
    "What Is a Real-Time Operating System?",
    "DigiKey",
    "https://www.digikey.com/en/videos/d/digi-key-electronics/introduction-to-rtos-part-1-what-is-a-real-time-operating-system-rtos",
  ),
  duck: resource(
    "open-duck-build",
    "The Open Duck Mini Droid: 4 Days of Soldering, Assembling, and Electrical Exorcisms",
    "Back to Engineering",
    "https://www.youtube.com/watch?v=tt-g_fi-eGU",
    "Build",
  ),
  pid: resource(
    "pid-control",
    "Understanding PID Control",
    "Brian Douglas · MathWorks",
    "https://www.mathworks.com/videos/series/understanding-pid-control.html",
  ),
  feedbackStarter: resource(
    "feedback-starter",
    "Feedback-control starter",
    "RoboAtlas",
    "./feedback-control.py",
  ),
  motorEncoder: resource(
    "motor-encoder",
    "How to Control a DC Motor with an Encoder",
    "Curio Res",
    "https://www.youtube.com/watch?v=dTGITLnYAY0",
  ),
  motorCompanion: resource(
    "motor-encoder-companion",
    "How to control a DC motor with an encoder",
    "Curio Res",
    "https://curiores.com/positioncontrol",
  ),
  motorCode: resource(
    "motor-encoder-code",
    "ArduinoTutorials: motor-control code",
    "Curio Res",
    "https://github.com/curiores/ArduinoTutorials",
  ),
  mpc: resource(
    "mpc-control",
    "Understanding Model Predictive Control",
    "MathWorks",
    "https://www.mathworks.com/videos/series/understanding-model-predictive-control.html",
  ),
  modern: resource(
    "modern-robotics",
    "Modern Robotics: Video Supplements",
    "Kevin Lynch · Northwestern University",
    "https://modernrobotics.northwestern.edu/nu-gm-book-resource/",
  ),
  manipulator: resource(
    "manipulator-algorithms",
    "Designing Robot Manipulator Algorithms",
    "MathWorks",
    "https://www.mathworks.com/videos/matlab-and-simulink-robotics-arena-designing-robot-manipulator-algorithms-1515776491590.html",
  ),
  rosOverview: resource(
    "ros2-overview",
    "Getting Started with ROS 2",
    "Mike Likes Robots",
    "https://www.youtube.com/watch?v=8aoFndU7jos",
  ),
  rosOverviewCompanion: resource(
    "ros2-overview-companion",
    "Getting Started with ROS 2",
    "Mike Likes Robots",
    "https://mikelikesrobots.github.io/blog/getting-started-ros-2/",
  ),
  rosCourse: resource(
    "learn-ros2",
    "Learn ROS 2",
    "Kevin Wood",
    "https://www.youtube.com/watch?v=HJAE5Pk8Nyw",
  ),
  jazzy: resource(
    "jazzy-installation",
    "ROS 2 Jazzy: Ubuntu installation",
    "Open Robotics",
    "https://docs.ros.org/en/jazzy/Installation/Ubuntu-Install-Debs.html",
  ),
  rosTutorials: resource(
    "jazzy-tutorials",
    "ROS 2 Jazzy: beginner tutorials",
    "Open Robotics",
    "https://docs.ros.org/en/jazzy/Tutorials.html",
  ),
  urdf: resource(
    "urdf-design",
    "URDF Design",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/concept-design/concept-urdf/",
  ),
  urdfExample: resource(
    "urdf-supplied-example",
    "01-myfirst.urdf: minimal robot model",
    "Open Robotics",
    "https://github.com/ros/urdf_tutorial/blob/ros2/urdf/01-myfirst.urdf",
  ),
  urdfJazzy: resource(
    "urdf-jazzy-tutorial",
    "Building a Visual Robot Model with URDF",
    "Open Robotics · ROS 2 Jazzy",
    "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/Building-a-Visual-Robot-Model-with-URDF-from-Scratch.html",
  ),
  gazebo: resource(
    "gazebo-simulation",
    "Gazebo Simulation",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/concept-design/concept-gazebo/",
  ),
  tf2: resource(
    "tf2-jazzy",
    "tf2 overview",
    "Open Robotics · ROS 2 Jazzy",
    "https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Tf2.html",
  ),
  cyrill: resource(
    "five-minutes-cyrill",
    "5 Minutes with Cyrill",
    "Cyrill Stachniss · University of Bonn",
    "https://www.ipb.uni-bonn.de/5min/index.html",
  ),
  lidar: resource(
    "adding-lidar",
    "Adding Lidar",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/hardware/lidar/",
  ),
  ball: resource(
    "ball-following",
    "Chasing a Tennis Ball with ROS",
    "Articulated Robotics",
    "https://www.youtube.com/watch?v=gISSSbYUZag",
    "Application",
  ),
  ballCompanion: resource(
    "ball-following-companion",
    "Object Tracking with OpenCV",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/applications/objtrack/",
    "Application",
  ),
  navigation: resource(
    "navigation-overview",
    "Autonomous Navigation",
    "Brian Douglas · MathWorks",
    "https://www.mathworks.com/videos/series/autonomous-navigation.html",
  ),
  fusion: resource(
    "sensor-fusion",
    "Understanding Sensor Fusion and Tracking",
    "MathWorks",
    "https://www.mathworks.com/videos/series/understanding-sensor-fusion-and-tracking.html",
  ),
  kalman: resource(
    "kalman-filters",
    "Understanding Kalman Filters",
    "MathWorks",
    "https://www.mathworks.com/videos/series/understanding-kalman-filters.html",
  ),
  particle: resource(
    "particle-filter",
    "Understanding the Particle Filter",
    "MathWorks",
    "https://www.mathworks.com/videos/autonomous-navigation-part-2-understanding-the-particle-filter-1594903924427.html",
  ),
  poseGraph: resource(
    "pose-graph-slam",
    "Understanding SLAM Using Pose Graph Optimization",
    "MathWorks",
    "https://www.mathworks.com/videos/autonomous-navigation-part-3-understanding-slam-using-pose-graph-optimization-1594984678407.html",
  ),
  slam: resource(
    "slam-toolbox",
    "SLAM with slam_toolbox",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/applications/slam/",
  ),
  path: resource(
    "path-planning",
    "Path Planning with A* and RRT",
    "MathWorks",
    "https://www.mathworks.com/videos/autonomous-navigation-part-4-path-planning-with-a-and-rrt-1594987710455.html",
  ),
  nav2: resource(
    "nav2-companion",
    "Navigation with Nav2",
    "Articulated Robotics",
    "https://articulatedrobotics.xyz/tutorials/mobile-robot/applications/nav2/",
    "Application",
  ),
  nav2Quickstart: resource(
    "nav2-jazzy-quickstart",
    "Nav2 Jazzy: TurtleBot3 quickstart",
    "Open Navigation",
    "https://docs.nav2.org/jazzy/getting_started/quickstart/quickstart/",
    "Application",
  ),
  metrics: resource(
    "navigation-metrics",
    "Metrics for System Assessment",
    "MathWorks",
    "https://www.mathworks.com/videos/autonomous-navigation-part-6-metrics-for-system-assessment-1597236837396.html",
  ),
  jointControl: resource(
    "joint-control",
    "Controlling Robot Manipulator Joints",
    "MathWorks",
    "https://www.mathworks.com/videos/matlab-and-simulink-robotics-arena-controlling-robot-manipulator-joints-1521714030608.html",
  ),
  trajectory: resource(
    "trajectory-planning",
    "Trajectory Planning for Robot Manipulators",
    "MathWorks",
    "https://www.mathworks.com/videos/trajectory-planning-for-robot-manipulators-1556705635398.html",
  ),
  moveit: resource(
    "moveit-tasks",
    "Getting Started with MoveIt",
    "Mike Likes Robots",
    "https://www.youtube.com/watch?v=yIVc5Xq0Xm4",
  ),
  moveitCompanion: resource(
    "moveit-tasks-companion",
    "Constructing Tasks with MoveIt",
    "Mike Likes Robots",
    "https://mikelikesrobots.github.io/blog/moveit-task-constructor/",
  ),
  moveitReference: resource(
    "moveit-reference",
    "MoveIt 2 documentation",
    "MoveIt",
    "https://moveit.picknik.ai/",
  ),
  arduinoLearning: resource(
    "arduino-learning",
    "Machine Learning on Arduino Uno Was a Good Idea",
    "Nikodem Bartnik",
    "https://www.youtube.com/watch?v=PdSDhdciSpE",
    "Build",
  ),
  arduinoCompanion: resource(
    "arduino-learning-companion",
    "Machine Learning Robot Driving Autonomously with Arduino and LIDAR",
    "Nikodem Bartnik · Indystry",
    "https://indystry.cc/machine-learning-robot-driving-autonomously-with-arduino-and-lidar/",
    "Build",
  ),
  aloha: resource(
    "aloha",
    "ALOHA",
    "Tony Zhao and collaborators",
    "https://tonyzhaozh.github.io/aloha/",
    "Application",
  ),
  act: resource(
    "lerobot-act",
    "ALOHA and ACT: LeRobot Research Presentation #1",
    "Alexander Soare · Hugging Face",
    "https://www.youtube.com/watch?v=ft73x0LfGpM",
  ),
  actDocs: resource(
    "act-documentation",
    "ACT: Action Chunking with Transformers",
    "Hugging Face",
    "https://huggingface.co/docs/lerobot/act",
  ),
  arm: resource(
    "robot-arm-series",
    "Build a Robot Arm",
    "Back to Engineering",
    "https://www.backtoengineering.com/projects/robot-arm/",
    "Build",
  ),
  imitation: resource(
    "imitation-real-robots",
    "Imitation Learning on Real-World Robots",
    "Hugging Face",
    "https://huggingface.co/docs/lerobot/il_robots",
  ),
  dataset: resource(
    "lerobot-dataset-v3",
    "LeRobotDataset v3.0",
    "Hugging Face",
    "https://huggingface.co/docs/lerobot/lerobot-dataset-v3",
  ),
  alohaData: resource(
    "aloha-dataset",
    "ALOHA simulated insertion: episode 0",
    "LeRobot",
    "https://huggingface.co/datasets/lerobot/aloha_sim_insertion_human",
    "Application",
  ),
  alohaMetadata: resource(
    "aloha-metadata",
    "ALOHA simulated insertion: metadata",
    "LeRobot",
    "https://huggingface.co/datasets/lerobot/aloha_sim_insertion_human/raw/main/meta/info.json",
  ),
  alohaViewer: resource(
    "aloha-viewer",
    "ALOHA simulated insertion: episode 0 viewer",
    "LeRobot",
    "https://huggingface.co/spaces/lerobot/visualize_dataset?path=/lerobot/aloha_sim_insertion_human/episode_0",
    "Application",
  ),
  rl: resource(
    "reinforcement-learning",
    "Reinforcement Learning",
    "Brian Douglas · MathWorks",
    "https://www.mathworks.com/videos/series/reinforcement-learning.html",
  ),
  pendulum: resource(
    "sim-to-real-pendulum",
    "Reinforcement Learning on Hardware from Sim-to-Real: Rotary Inverted Pendulum",
    "Kevin Wood",
    "https://www.youtube.com/watch?v=PTsIg7wUC9U",
    "Application",
  ),
  pendulumReference: resource(
    "pendulum-project",
    "Rotary inverted pendulum: project reference",
    "Kevin Wood Robotics",
    "https://kevinwoodrobotics.com/product/reinforcement-learning-on-hardware-from-sim-to-real-rotary-inverted-pendulum/",
    "Application",
  ),
  drone: resource(
    "drone-control",
    "Drone Simulation and Control",
    "MathWorks",
    "https://www.mathworks.com/videos/series/drone-simulation-and-control.html",
  ),
  locomotion: resource(
    "perceptive-locomotion",
    "Learning Robust Perceptive Locomotion",
    "ETH Zürich · Robotic Systems Lab",
    "https://leggedrobotics.github.io/rl-perceptiveloco/",
    "Application",
  ),
  agileFlight: resource(
    "agile-autonomy",
    "Learning High-Speed Flight in the Wild",
    "University of Zürich · Robotics and Perception Group",
    "https://rpg.ifi.uzh.ch/AgileAutonomy.html",
    "Application",
  ),
  rpl: resource(
    "humanoid-locomotion",
    "RPL: Robust Humanoid Perceptive Locomotion",
    "RPL research team",
    "https://rpl-humanoid.github.io/",
    "Application",
  ),
  vla: resource(
    "vla-introduction",
    "LLMs Meet Robotics: What Are Vision-Language-Action Models? Episode 1",
    "Ilia Larchenko",
    "https://www.youtube.com/watch?v=8dZUOo5xWFw",
  ),
  smolvla: resource(
    "smolvla",
    "SmolVLA",
    "Hugging Face",
    "https://huggingface.co/docs/lerobot/smolvla",
  ),
  modelBased: resource(
    "model-based-rl",
    "Why Choose Model-Based Reinforcement Learning?",
    "MathWorks",
    "https://www.mathworks.com/videos/why-choose-model-based-reinforcement-learning-1657878550459.html",
  ),
  worldModels: resource(
    "world-foundation-models",
    "World Foundation Models",
    "Computerphile",
    "https://www.youtube.com/watch?v=pdV9eaLy--E",
  ),
  physicalIntro: resource(
    "physical-ai-workflow",
    "Learning Physical AI: introduction",
    "Back to Engineering",
    "https://www.youtube.com/watch?v=jWKu089Kj6A",
  ),
  physicalOverview: resource(
    "physical-ai-curriculum",
    "Learning Physical AI: A Sim-to-Real VLA Pipeline with Seeed reBot Arm and NVIDIA Isaac",
    "Seeed Studio",
    "https://www.seeedstudio.com/blog/2026/08/19/learning-physical-ai-a-sim-to-real-vla-pipeline-with-seeed-rebot-arm-and-nvidia-isaac/",
  ),
};

// Internal planning only: conservative study budgets include pauses and reading, not just runtime.
// These are sizing assumptions for a working learning environment, never promises about setup/debugging.
export const workloadEstimates: Record<string, number> = {};

// Research provenance is internal, not website copy. Conceptual scopes below are
// grounded in creator chapters or primary companion material, not invented chapters.
export const sourceVerification = {
  princeton:
    "Official Lecture1.pdf: examples/definitions, then anatomy and uncertainty; course administration excluded.",
  ros2: "Creator chapters through introductory RViz; later Gazebo/control chapters excluded. Commands use Jazzy references.",
  motors:
    "Creator chapters separate controller/power/open-loop material from encoder feedback and ROS interfaces.",
  duck: "Creator chapters cover structure, soldering, servo debugging, electrical checks, and wiring.",
  moveit:
    "Creator chapters and companion separate planning/visualization, Task Constructor stages, and complete pick/place.",
  act: "Official ACT companion Architecture, Training ACT, and Evaluating ACT support conceptual scopes. The full presentation has no creator chapters; caption bodies were unavailable. Scopes are not claimed as official video chapters.",
  arm: "Creator companion identifies Episodes 5–7 and their recording, logging, training, and deployment portions; the supplied portal is used because individual episode URLs were not exposed.",
  vla: "Creator Architecture, Training, and Fine-tuning Preparation chapters.",
  dataset:
    "Actual ALOHA meta/info.json is v3.0; its dataset card retains an older v2 example. Episode 0 uses the official viewer.",
  setup:
    "Readiness and first-failure checkpoints are bounded tasks. Full installation/debugging duration is unpredictable; execution tasks require their stated working environment.",
} as const;

function learn(
  id: string,
  title: string,
  resources: LearningResource[],
  scope: string,
  legacyUnitIds?: string[],
  minutes = 35,
): LearningSection {
  workloadEstimates[id] = minutes;
  return {
    id,
    title,
    resources,
    scope,
    ...(legacyUnitIds ? { legacyUnitIds } : {}),
  };
}

function practice(
  id: string,
  title: string,
  resources: LearningResource[],
  task: string,
  scope?: string,
  minutes = 40,
): LearningSection {
  workloadEstimates[id] = minutes;
  return { id, title, resources, task, ...(scope ? { scope } : {}) };
}

export const roadmap: RoadmapStage[] = [
  {
    id: "systems-foundations",
    title: "Complete robotic systems",
    shortTitle: "Complete systems",
    topicGroupId: "complete-systems",
    sections: [
      learn(
        "robot-examples-definitions",
        "Robot examples and definitions",
        [sources.princeton, sources.princetonCourse],
        "Lecture 1: technical examples through “What is a robot?” Skip course administration.",
        ["princeton-lecture-one"],
      ),
      learn(
        "robot-anatomy-uncertainty",
        "Anatomy, feedback, and uncertainty",
        [sources.princeton, sources.princetonCourse],
        "Lecture 1: “Anatomy of a robotic system” through “What makes robotics hard?”",
        ["princeton-lecture-one"],
      ),
      learn(
        "mobile-robot-overview",
        "A mobile robot as a complete system",
        [sources.mobileOverview, sources.mobileCompanion],
        "Watch the project overview and inspect its robot overview and project breakdown.",
      ),
      learn(
        "hoop-system-case-study",
        "A ball-seeking hoop",
        [sources.hoop],
        "Watch the build and its sensing-to-movement decisions.",
        ["hoop-build"],
      ),
      practice(
        "sensor-action-loop",
        "Sketch a feedback loop",
        [],
        "Sketch one sensor → estimate → plan → control → actuator loop from either robot; mark the feedback path.",
        undefined,
        15,
      ),
    ],
  },
  {
    id: "actuation-power",
    title: "Motors, feedback, and power",
    shortTitle: "Motors & power",
    topicGroupId: "hardware-embedded",
    sections: [
      learn(
        "motor-control-chain",
        "The motor-control chain",
        [sources.motors],
        "Study the layered controller chain, drivers, wiring, circuit demonstration, and open-loop motor control; stop before encoder feedback.",
      ),
      learn(
        "motor-encoders-software",
        "Encoders and software interfaces",
        [sources.motors],
        "Study encoder feedback and closed-loop control through the ROS driver and control interface.",
      ),
      learn(
        "power-voltage-regulation",
        "Voltage and regulation",
        [sources.power],
        "Study Power 101 and Voltages for our robot, including the embedded video's matching explanation.",
      ),
      learn(
        "power-current-batteries",
        "Current, batteries, and protection",
        [sources.power],
        "Study Current in our robot and the remaining battery, capacity, charging, and circuit-planning material.",
      ),
      learn(
        "rtos-timing",
        "Real-time operating systems",
        [sources.rtos, sources.rtosReference],
        "Watch Part 1: What Is a Real-Time Operating System?",
        ["what-is-rtos"],
      ),
    ],
  },
  {
    id: "hardware-build-diagnosis",
    title: "Hardware assembly and troubleshooting",
    shortTitle: "Build & diagnosis",
    topicGroupId: "hardware-embedded",
    sections: [
      learn(
        "duck-mechanical-assembly",
        "A walking robot's mechanical assembly",
        [sources.duck],
        "Study the Open Duck Mini hardware assembly: printed structure, joints, and component fit. Reproduction is optional.",
      ),
      learn(
        "duck-electronics-integration",
        "Electronics, integration, and build failures",
        [sources.duck],
        "Study the electronics, wiring, and assembly troubleshooting; leave policy training outside this selection.",
      ),
      practice(
        "hardware-fault-diagnosis",
        "Trace one hardware fault",
        [],
        "For a motor that does not turn, list one power, driver, encoder, mechanical, and software check; choose the first safe observation.",
        undefined,
        20,
      ),
    ],
  },
  {
    id: "feedback-foundations",
    title: "Feedback control",
    shortTitle: "Feedback control",
    topicGroupId: "feedback-control",
    sections: [
      learn(
        "pid-fundamentals",
        "PID fundamentals",
        [sources.pid],
        "Watch Part 1: What Is PID Control?",
        ["pid-part-one"],
      ),
      learn(
        "pid-windup",
        "Saturation and anti-windup",
        [sources.pid],
        "Watch Part 2: Anti-windup for PID Control.",
        ["pid-part-two"],
      ),
      learn(
        "pid-noise",
        "Derivative action and sensor noise",
        [sources.pid],
        "Watch Part 3: Expanding Beyond a Simple Derivative.",
        ["pid-part-three"],
      ),
      learn(
        "pid-tuning",
        "Choosing PID gains",
        [sources.pid],
        "Watch Part 4: A PID Tuning Guide.",
        ["pid-part-four"],
      ),
      learn(
        "pid-sampling",
        "Sampling and discrete control",
        [sources.pid],
        "Watch Part 7: Important PID Concepts.",
        ["pid-part-seven"],
      ),
      practice(
        "scalar-feedback-simulation",
        "Simulate a proportional controller",
        [sources.feedbackStarter],
        "Run the Python starter with Kp = 1. Plot 200 steps of x_next = 0.9*x + 0.1*u, with u = Kp*(1 - x) and x initially zero. Compare the response with the target 1.",
        "Requires Python and matplotlib; no MATLAB or hardware.",
      ),
    ],
  },
  {
    id: "control-experiments-mpc",
    title: "Control experiments and prediction",
    shortTitle: "Control experiments",
    topicGroupId: "feedback-control",
    sections: [
      practice(
        "feedback-gain-comparison",
        "Compare one controller parameter",
        [sources.feedbackStarter],
        "Change only the starter's Kp values to 0.5 and 2. Overlay the responses and compare settling and steady-state error.",
      ),
      learn(
        "encoder-reading",
        "Reading an encoder",
        [sources.motorEncoder, sources.motorCompanion],
        "Study encoder signals and position measurement in Parts 1–2 of the companion. Watch the matching video portion; building the circuit is optional.",
      ),
      learn(
        "encoder-pid-loop",
        "Closing the motor-position loop",
        [sources.motorEncoder, sources.motorCompanion, sources.motorCode],
        "Study motor driving and PID position control in the remaining companion sections. Trace target → error → control signal; hardware reproduction is optional.",
      ),
      learn(
        "mpc-concepts",
        "Model predictive control",
        [sources.mpc],
        "Watch Parts 1 and 2 only: Why Use MPC? and What Is MPC?",
      ),
    ],
  },
  {
    id: "frames-transformations",
    title: "Frames, rotations, and transformations",
    shortTitle: "Frames & transforms",
    topicGroupId: "geometry-kinematics",
    sections: [
      learn(
        "degrees-of-freedom",
        "Degrees of freedom",
        [sources.modern],
        "Watch 2.1: Degrees of Freedom of a Rigid Body and 2.2: Degrees of Freedom of a Robot.",
        ["rigid-body-dof", "robot-dof"],
      ),
      learn(
        "workspace-task-space",
        "Task space and workspace",
        [sources.modern],
        "Watch 2.5: Task Space and Workspace.",
        ["task-space-workspace"],
      ),
      learn(
        "rigid-body-rotations",
        "Rigid-body motion and rotation matrices",
        [sources.modern],
        "Watch Introduction to Rigid-Body Motions and Rotation Matrices, Parts 1 and 2.",
        [
          "rigid-body-motions",
          "rotation-matrices-one",
          "rotation-matrices-two",
        ],
        45,
      ),
      learn(
        "homogeneous-transforms",
        "Homogeneous transformations",
        [sources.modern],
        "Watch Homogeneous Transformation Matrices.",
        ["homogeneous-transformations"],
      ),
      practice(
        "camera-base-transform",
        "Transform a camera-relative point",
        [sources.modern],
        "Apply a 90-degree Z rotation and translation (1, 2, 0) to point (1, 0, 0). Label the camera and base frames and verify the resulting point.",
        undefined,
        25,
      ),
    ],
  },
  {
    id: "manipulator-kinematics",
    title: "Manipulator kinematics",
    shortTitle: "Manipulator kinematics",
    topicGroupId: "geometry-kinematics",
    sections: [
      learn(
        "manipulator-model-kinematics",
        "Robot descriptions and kinematics",
        [sources.manipulator],
        "Study robot-description import, forward/inverse kinematics, and waypoint tracking. Observe the demonstrations; reproducing software is optional.",
        ["designing-manipulators"],
      ),
      learn(
        "manipulator-simulation-perception",
        "Simulation and perception integration",
        [sources.manipulator],
        "Study the later Simscape simulation, supervisory-logic, and perception-integrated manipulation demonstrations.",
        ["designing-manipulators"],
      ),
      practice(
        "two-link-reachability",
        "Check a two-link arm's reachability",
        [],
        "For two unit-length links, compare targets (1, 1) and (3, 0). Explain which is reachable and sketch possible elbow configurations.",
        undefined,
        25,
      ),
    ],
  },
  {
    id: "ros2-communication",
    title: "ROS 2 communication",
    shortTitle: "ROS 2 communication",
    topicGroupId: "ros-simulation",
    sections: [
      learn(
        "ros2-system-overview",
        "The ROS 2 system model",
        [sources.rosOverview, sources.rosOverviewCompanion],
        "Watch the overview and read its companion's explanation of ROS 2 components.",
      ),
      learn(
        "ros2-environment-executables",
        "Sourcing and executables",
        [sources.rosCourse],
        "Watch the introductory environment-sourcing and package-executable chapters. Use Jazzy documentation for installation, not the video's Humble setup.",
      ),
      learn(
        "ros2-nodes-topics",
        "Nodes and topics",
        [sources.rosCourse],
        "Watch Nodes and Topics; inspect how publishers and subscribers exchange messages.",
      ),
      learn(
        "ros2-services-parameters",
        "Services and parameters",
        [sources.rosCourse],
        "Watch Services and Parameters.",
      ),
      learn(
        "ros2-actions",
        "Actions",
        [sources.rosCourse],
        "Watch Actions; distinguish feedback and cancellation from a service response.",
      ),
    ],
  },
  {
    id: "ros2-development",
    title: "ROS 2 development workflow",
    shortTitle: "ROS 2 development",
    topicGroupId: "ros-simulation",
    sections: [
      learn(
        "ros2-workspaces-packages",
        "Workspaces, colcon, and packages",
        [sources.rosCourse],
        "Watch Workspace, colcon Build, and Package Creation.",
      ),
      learn(
        "ros2-cpp-publisher",
        "A C++ publisher and subscriber",
        [sources.rosCourse, sources.rosTutorials],
        "Study the C++ publisher/subscriber example. Use the matching Jazzy tutorial for compatible commands.",
      ),
      learn(
        "ros2-python-publisher",
        "A Python publisher and subscriber",
        [sources.rosCourse, sources.rosTutorials],
        "Study the Python publisher/subscriber example. Compare its message flow with the C++ example.",
      ),
      learn(
        "ros2-launch-files",
        "Launch files",
        [sources.rosCourse],
        "Watch the introductory Launch Files chapter; stop before URDF.",
      ),
      practice(
        "ros2-environment-readiness",
        "Check the Jazzy environment",
        [sources.jazzy, sources.urdfJazzy],
        "Check Ubuntu release, sourced Jazzy, and availability of ros2, urdf_tutorial, urdf_launch, robot_state_publisher, and RViz. Record the first unmet prerequisite and its next action; do not attempt an entire installation or debug every blocker here.",
        "A readiness checkpoint: dependent execution tasks require the prepared environment.",
      ),
      practice(
        "ros2-publish-inspect",
        "Publish and inspect one message",
        [sources.rosTutorials],
        "Run the Jazzy publisher/subscriber example. Use ros2 topic list, ros2 topic info, and ros2 topic echo to inspect one message stream.",
        "Requires the prepared Jazzy environment.",
      ),
    ],
  },
  {
    id: "robot-models-transforms",
    title: "Robot models and transforms",
    shortTitle: "Models & transforms",
    topicGroupId: "ros-simulation",
    sections: [
      learn(
        "ros2-urdf",
        "URDF links and joints",
        [sources.rosCourse],
        "Watch the introductory URDF chapter.",
      ),
      learn(
        "ros2-xacro",
        "Xacro",
        [sources.rosCourse],
        "Watch the introductory Xacro chapter.",
      ),
      learn(
        "ros2-rviz",
        "RViz",
        [sources.rosCourse],
        "Watch the introductory RViz chapter only. Stop before the advanced simulation/control material.",
      ),
      learn(
        "urdf-drive-model",
        "A differential-drive robot description",
        [sources.urdf],
        "Study Differential Drive Robots and Working With URDF Files, including launching and visualising.",
      ),
      learn(
        "urdf-visual-collision",
        "Geometry, collision, and inertia",
        [sources.urdf],
        "Study Creating our URDF: core, wheel/caster geometry, collision, and inertial properties.",
      ),
    ],
  },
  {
    id: "simulation-integration",
    title: "Simulation and integration",
    shortTitle: "Simulation",
    topicGroupId: "ros-simulation",
    sections: [
      learn(
        "gazebo-spawn-time",
        "Spawning a model and simulation time",
        [sources.gazebo],
        "Study Spawning our robot in Gazebo: robot_state_publisher, use_sim_time, ROS compatibility, and model creation.",
      ),
      learn(
        "gazebo-physical-properties",
        "Simulation properties and launch integration",
        [sources.gazebo],
        "Study Simulation improvements: launch files, friction, torque/velocity limits, and inertial behaviour.",
      ),
      learn(
        "gazebo-drive-control",
        "Driving the simulated robot",
        [sources.gazebo],
        "Study the remaining differential-drive plugin, velocity-command, odometry, and launch material.",
      ),
      learn(
        "tf2-frame-tree",
        "The transform tree",
        [sources.tf2],
        "Read the tf2 overview for Jazzy: coordinate frames, transforms, and time.",
      ),
      practice(
        "sensor-pose-change",
        "Inspect one sensor transform",
        [sources.urdfExample, sources.urdfJazzy, sources.tf2],
        "Copy 01-myfirst.urdf locally. Add sensor_link and a fixed joint from base_link with origin 0.1 0 0.3. Display the copy, enable TF in RViz, change x to 0.2, relaunch, and compare the sensor-frame axes.",
        "After the Jazzy readiness check, use urdf_tutorial/display.launch.py with the copy's absolute path as model. No Gazebo or custom robot build is needed.",
      ),
      practice(
        "simulation-readiness",
        "Check the supplied simulation prerequisites",
        [sources.nav2Quickstart],
        "Check that the Jazzy Nav2 bringup and minimal TurtleBot3 simulation packages are installed and their launch file is discoverable. Record the first unmet prerequisite.",
        "Use Gazebo Harmonic and the official supplied TurtleBot3 example.",
      ),
    ],
  },
  {
    id: "camera-geometry-registration",
    title: "Camera geometry and registration",
    shortTitle: "Perception geometry",
    topicGroupId: "perception",
    sections: [
      learn(
        "camera-calibration",
        "Camera frames and calibration",
        [sources.cyrill],
        "Watch Camera Intrinsics and Extrinsics, then Intrinsic Camera Calibration.",
        ["camera-intrinsics-extrinsics", "intrinsic-calibration"],
      ),
      learn(
        "stereo-depth-section",
        "Depth from stereo",
        [sources.cyrill],
        "Watch 3D from Stereo.",
        ["stereo-depth"],
      ),
      learn(
        "absolute-orientation",
        "Absolute orientation",
        [sources.cyrill],
        "Watch Absolute Orientation Problem.",
      ),
      learn(
        "point-set-alignment",
        "Iterative closest point",
        [sources.cyrill],
        "Watch Iterative Closest Point.",
        ["iterative-closest-point"],
      ),
      learn(
        "lidar-odometry",
        "LiDAR odometry",
        [sources.cyrill],
        "Watch LiDAR Odometry.",
      ),
    ],
  },
  {
    id: "perception-action",
    title: "Perception for physical action",
    shortTitle: "Perception → action",
    topicGroupId: "perception",
    sections: [
      learn(
        "lidar-messages",
        "LiDAR measurements and messages",
        [sources.lidar],
        "Study What is LIDAR? and Lidars in ROS: LaserScan, PointCloud2, and sensor frames.",
      ),
      learn(
        "lidar-integration",
        "LiDAR simulation and integration",
        [sources.lidar],
        "Study the simulated lidar, ROS bridge/visualisation, and physical-driver explanation. Hardware reproduction is optional.",
      ),
      learn(
        "ball-detection-node",
        "Detecting the ball",
        [sources.ball, sources.ballCompanion],
        "Study the object-tracking overview, simulation preparation, and detection/image-processing node. Full implementation is optional.",
      ),
      learn(
        "ball-following-node",
        "Turning detections into movement",
        [sources.ball, sources.ballCompanion],
        "Study the following node, command velocity, simulation/real-robot demonstrations, and the effects of camera pose and latency.",
      ),
    ],
  },
  {
    id: "state-estimation-fusion",
    title: "State estimation and sensor fusion",
    shortTitle: "Estimation & fusion",
    topicGroupId: "estimation-slam",
    sections: [
      learn(
        "navigation-system-overview",
        "What autonomous navigation requires",
        [sources.navigation],
        "Watch Part 1: What Is Autonomous Navigation?",
        ["navigation-introduction"],
      ),
      learn(
        "fusion-foundations",
        "Why combine sensors?",
        [sources.fusion],
        "Watch Part 1: What Is Sensor Fusion?",
        ["fusion-introduction"],
      ),
      learn(
        "fusion-orientation-section",
        "Fusing orientation measurements",
        [sources.fusion],
        "Watch Part 2: Fusing a Mag, Accel, and Gyro to Estimate Orientation.",
        ["fusion-orientation"],
      ),
      learn(
        "kalman-observers",
        "Prediction and state observers",
        [sources.kalman],
        "Watch Parts 1 and 2: Why Use Kalman Filters? and State Observers.",
        undefined,
        40,
      ),
      learn(
        "kalman-optimal-estimator",
        "The Kalman prediction/correction algorithm",
        [sources.kalman],
        "Watch Parts 3 and 4: An Optimal State Estimator and An Optimal State Estimation Algorithm.",
        undefined,
        45,
      ),
      learn(
        "kalman-nonlinear",
        "Nonlinear state estimation",
        [sources.kalman],
        "Watch Part 5: Nonlinear State Estimators.",
      ),
    ],
  },
  {
    id: "localization-mapping",
    title: "Localization, drift, and SLAM",
    shortTitle: "Localization & SLAM",
    topicGroupId: "estimation-slam",
    sections: [
      practice(
        "scalar-kalman-update",
        "Compute one correction",
        [],
        "Use predicted x = 1, variance 0.2, measurement z = 1.4, and measurement variance 0.8. Compute K = P/(P+R), corrected x, and (1-K)*P. Swap the variances and compare.",
        undefined,
        25,
      ),
      practice(
        "wheel-slip-reasoning",
        "Reason about wheel slip",
        [],
        "A wheel reports movement while the robot is stuck. Explain how encoder odometry drifts and which independent measurement could reveal the mismatch.",
        undefined,
        15,
      ),
      learn(
        "particle-localization",
        "Particle-filter localization",
        [sources.particle],
        "Watch Understanding the Particle Filter.",
        ["navigation-particle-filter"],
      ),
      learn(
        "pose-graph-mapping",
        "Pose graphs and loop closure",
        [sources.poseGraph],
        "Watch Understanding SLAM Using Pose Graph Optimization.",
        ["navigation-pose-graph-slam"],
      ),
      learn(
        "slam-frames-concepts",
        "SLAM frames and inputs",
        [sources.slam],
        "Study Overview and SLAM in ROS: mapping versus localisation, map/odom/base frames, laser scans, and transforms.",
      ),
      learn(
        "slam-run-save",
        "Running and saving a map",
        [sources.slam],
        "Study running slam_toolbox, building and saving a map, and serialized pose-graph reuse. Follow the supplied example; a custom build is optional.",
      ),
    ],
  },
  {
    id: "navigation-foundations",
    title: "Planning and the supplied navigation simulation",
    shortTitle: "Planning & simulation",
    topicGroupId: "planning-autonomy",
    sections: [
      learn(
        "path-planning-concepts",
        "Planning with A* and RRT",
        [sources.path],
        "Watch Path Planning with A* and RRT.",
        ["navigation-path-planning"],
      ),
      learn(
        "nav2-costmaps",
        "Nav2 and costmaps",
        [sources.nav2],
        "Study the navigation overview and costmap explanation; distinguish a map, costmap, planner, controller, and localizer.",
      ),
      learn(
        "nav2-walkthrough",
        "Nav2 configuration and launch flow",
        [sources.nav2],
        "Study the remaining preparation, configuration, launch, localization, goal, and troubleshooting walkthrough. Adapt commands to Jazzy; a custom robot is optional.",
        undefined,
        45,
      ),
      practice(
        "nav2-prepare-example",
        "Prepare the provided TurtleBot3 example",
        [sources.nav2Quickstart],
        "Using the earlier readiness check, source Jazzy and check the default launch arguments and installed map/world assets. Keep the supplied TurtleBot3 configuration; identify the first missing prerequisite if blocked.",
        "Ubuntu 24.04, ROS 2 Jazzy, and Gazebo Harmonic; no custom robot or world.",
      ),
      practice(
        "nav2-launch-example",
        "Launch the robot, world, and map",
        [sources.nav2Quickstart],
        "Run the Jazzy Running the Example command with headless:=False. Confirm Gazebo, RViz, the supplied map, and the Nav2 lifecycle state; diagnose the first launch failure before continuing.",
      ),
    ],
  },
  {
    id: "navigation-experiments",
    title: "Navigation experiments and assessment",
    shortTitle: "Navigation experiments",
    topicGroupId: "planning-autonomy",
    sections: [
      practice(
        "nav2-initial-pose-goal",
        "Set the pose and send a goal",
        [sources.nav2Quickstart],
        "Match the robot's Gazebo pose with 2D Pose Estimate in RViz, then send one reachable Nav2 goal. Confirm the particle cloud and resulting motion.",
      ),
      practice(
        "nav2-inspect-path",
        "Inspect the path and costmap",
        [sources.nav2Quickstart, sources.nav2],
        "Display the planned path and local/global costmaps in RViz for that goal. Identify an obstacle, inflation, the route, and the controller's local motion.",
      ),
      practice(
        "nav2-investigate-failure",
        "Investigate one navigation failure",
        [sources.nav2Quickstart, sources.nav2],
        "Try a goal inside an occupied map cell. Capture the reported failure and inspect localization, map/costmap, path, and command output before changing anything.",
      ),
      practice(
        "nav2-record-results",
        "Record a small result comparison",
        [],
        "Repeat three reachable goals from a consistent initial pose. Record success/failure, collision, completion time, and one observed failure condition; compare with the failed goal.",
        undefined,
        30,
      ),
      learn(
        "navigation-assessment-section",
        "Metrics beyond a successful demo",
        [sources.metrics],
        "Watch Metrics for System Assessment.",
        ["navigation-assessment"],
      ),
    ],
  },
  {
    id: "manipulation-control",
    title: "Manipulator control and task planning",
    shortTitle: "Manipulation",
    topicGroupId: "manipulation",
    sections: [
      learn(
        "manipulator-joint-control",
        "Controlling manipulator joints",
        [sources.jointControl],
        "Watch the joint-control explanation: actuator dynamics, inverse dynamics, feedforward, feedback, and grasping. MATLAB reproduction is optional.",
        undefined,
        45,
      ),
      learn(
        "manipulator-trajectory-planning",
        "Planning manipulator trajectories",
        [sources.trajectory],
        "Watch Trajectory Planning for Robot Manipulators: task/joint space, interpolation, and rotation trajectories.",
        ["manipulator-trajectories"],
        40,
      ),
      learn(
        "moveit-planning-basics",
        "MoveIt planning and visualization",
        [sources.moveit, sources.moveitCompanion, sources.moveitReference],
        "Study MoveIt Tutorials 1–5 in the companion: RViz quickstart, first C++ project, visualization, and planning around objects. Read the setup explanation; source compilation is optional.",
        undefined,
        45,
      ),
      learn(
        "moveit-task-stages",
        "Task Constructor stages and picking",
        [sources.moveit, sources.moveitCompanion],
        "Study Tasks and Stages and Planning a Pick: generators, propagators, connectors, inverse kinematics, collision permissions, and attachment.",
        undefined,
        40,
      ),
      learn(
        "moveit-end-to-end",
        "Connecting pick and place",
        [sources.moveit, sources.moveitCompanion],
        "Study End-to-end Pick and Place and the remaining code explanation. Trace the stage order; full reproduction is optional.",
      ),
      practice(
        "pick-place-trace",
        "Trace a pick-and-place task",
        [],
        "Sketch recognize → reach → grasp → lift → transfer → place. Mark a collision constraint and one separate success check for grasping and retaining the object.",
        undefined,
        20,
      ),
    ],
  },
  {
    id: "demonstration-learning",
    title: "From demonstrations to action chunks",
    shortTitle: "Demonstrations & ACT",
    topicGroupId: "imitation-learning",
    sections: [
      learn(
        "arduino-demonstrations",
        "Driving demonstrations and features",
        [sources.arduinoLearning, sources.arduinoCompanion],
        "Study the robot and Data collection through Feature selection. Identify the lidar observations and driving labels; hardware reproduction is optional.",
      ),
      learn(
        "arduino-policy-rollout",
        "A learned driving policy",
        [sources.arduinoLearning, sources.arduinoCompanion],
        "Study Training the classifier and the remaining deployment/driving explanation. Separate recorded labels, test predictions, and autonomous driving.",
      ),
      learn(
        "aloha-system-rollouts",
        "ALOHA and autonomous rollouts",
        [sources.aloha],
        "Study the main explanation, teleoperation system, and autonomous examples. Identify observations, joint actions, and action chunks.",
      ),
      learn(
        "aloha-labeled-failure",
        "Inspect an ALOHA failure",
        [sources.aloha],
        "Inspect a labeled failure example on the project page. Identify the first visible error and how later actions amplify it.",
      ),
      learn(
        "act-architecture",
        "ACT architecture and action chunks",
        [sources.act, sources.actDocs],
        "Study the presentation's ALOHA/ACT architecture explanation alongside Architecture in the documentation: camera/joint inputs, latent variable, and future action chunks.",
        undefined,
        45,
      ),
      learn(
        "act-training-evaluation",
        "ACT training, inference, and evaluation",
        [sources.act, sources.actDocs],
        "Study the presentation's remaining training, inference, and evaluation discussion alongside Training ACT and Evaluating ACT. No training run is required.",
        undefined,
        45,
      ),
    ],
  },
  {
    id: "robot-learning-workflow",
    title: "Collection, logging, and learned execution",
    shortTitle: "Robot-learning workflow",
    topicGroupId: "imitation-learning",
    sections: [
      learn(
        "arm-episode-five",
        "Episode 5: LeRobot SO101 Upgrade",
        [sources.arm],
        "Study Episode 5 only: teleoperation, calibration, and the SO101 hardware/LeRobot upgrade. Hardware purchase is unnecessary.",
      ),
      learn(
        "arm-episode-six",
        "Episode 6: Logging & Visualization",
        [sources.arm],
        "Study Episode 6 only: Python structure, JSON movement logging, and Rerun visualization.",
      ),
      learn(
        "arm-episode-seven-record",
        "Episode 7: recording a policy dataset",
        [sources.arm],
        "Study the data-recording portion of Episode 7: Custom AI Policy, using the LeRobot SDK.",
      ),
      learn(
        "arm-episode-seven-deploy",
        "Episode 7: training and deployment",
        [sources.arm],
        "Study the policy-training and pick-up demonstration portion of Episode 7. Distinguish teleoperation, replay, and autonomous execution; reproduction is optional.",
      ),
      learn(
        "lerobot-record-visualize",
        "LeRobot collection and visualization",
        [sources.imitation],
        "Read the current guide's recording, replay, and dataset-visualization workflow; identify calibration, camera, robot, and episode boundaries. No physical collection is required.",
      ),
      learn(
        "lerobot-train-evaluate",
        "Training and evaluating a rollout",
        [sources.imitation],
        "Read the current training and evaluation workflow, including policy loading and rollout visualization. Trace the data/model/control flow without a full training run.",
      ),
    ],
  },
  {
    id: "demonstration-data-evaluation",
    title: "Inspect demonstration data and design evaluation",
    shortTitle: "Data & evaluation",
    topicGroupId: "imitation-learning",
    sections: [
      learn(
        "dataset-v3-structure",
        "Episodes, files, and aligned signals",
        [sources.dataset],
        "Read Format design and the directory/metadata layout. Identify episode boundaries, timestamps, state/action fields, and video alignment; v3 files can contain several episodes.",
      ),
      practice(
        "aloha-episode-zero",
        "Inspect ALOHA insertion episode 0",
        [sources.alohaData, sources.alohaMetadata, sources.alohaViewer],
        "Open episode 0 in the official viewer and compare its observation/action plots and camera frames. Use meta/info.json: v3.0, 50 Hz, one top camera, and 14-dimensional state/action. Locate episode and frame boundaries.",
        "Use the current raw metadata, not the dataset card's older v2 example. No training or download of the whole dataset is required.",
      ),
      practice(
        "demonstration-evaluation-design",
        "Design an episode-level evaluation",
        [],
        "Propose a held-out episode split, an insertion success condition, and one shifted starting condition. Explain why low offline action error alone does not prove a successful rollout.",
        undefined,
        25,
      ),
    ],
  },
  {
    id: "reinforcement-foundations",
    title: "Reinforcement-learning foundations",
    shortTitle: "RL foundations",
    topicGroupId: "reinforcement-learning",
    sections: [
      learn(
        "rl-introduction",
        "What reinforcement learning changes",
        [sources.rl],
        "Watch Part 1: What Is Reinforcement Learning?",
        ["rl-part-one"],
      ),
      learn(
        "rl-environment-rewards",
        "Environments and rewards",
        [sources.rl],
        "Watch Part 2: Understanding the Environment and Rewards.",
        ["rl-part-two"],
      ),
      learn(
        "rl-policy-learning",
        "Policies and learning algorithms",
        [sources.rl],
        "Watch Part 3: Understanding Policies and Learning Algorithms.",
        ["rl-part-three"],
        40,
      ),
      learn(
        "rl-practical-challenges",
        "Practical challenges",
        [sources.rl],
        "Watch Part 5: Overcoming Practical Challenges with Reinforcement Learning.",
        ["rl-part-five"],
        40,
      ),
    ],
  },
  {
    id: "sim-to-real",
    title: "Reinforcement learning from simulation to hardware",
    shortTitle: "Sim-to-real",
    topicGroupId: "reinforcement-learning",
    sections: [
      learn(
        "rl-hardware-transfer",
        "Reinforcement learning on hardware",
        [sources.rl],
        "Watch Reinforcement Learning on Hardware from the same series.",
        ["rl-on-hardware"],
      ),
      learn(
        "rotary-pendulum-transfer",
        "A rotary-pendulum transfer case study",
        [sources.pendulum, sources.pendulumReference],
        "Watch Kevin's public video: modelling, simulator/hardware matching, training, deployment, and debugging. The paid code/documentation product is not required.",
      ),
      practice(
        "transfer-diagnosis",
        "Diagnose one transfer mismatch",
        [],
        "A stable simulated pendulum oscillates on hardware. Choose one hypothesis involving delay, units/action scaling, noise, dynamics, or starting state, and propose one measurement that could reject it.",
        undefined,
        20,
      ),
    ],
  },
  {
    id: "drone-walking-foundations",
    title: "Flight control and walking foundations",
    shortTitle: "Flight & walking",
    topicGroupId: "drones-legged",
    sections: [
      learn(
        "drone-control-problem-section",
        "Setting up drone control",
        [sources.drone],
        "Watch Setting Up the Control Problem.",
        ["drone-control-problem"],
      ),
      learn(
        "drone-hover-section",
        "How a drone hovers",
        [sources.drone],
        "Watch How Do You Get a Drone to Hover?",
        ["drone-hover"],
      ),
      learn(
        "walking-rl-problem",
        "The walking-robot RL problem",
        [sources.rl],
        "Watch Part 4: The Walking Robot Problem.",
        ["rl-part-four"],
      ),
      learn(
        "eth-locomotion-demo",
        "Perceptive locomotion demonstration",
        [sources.locomotion],
        "Watch the main Learning Robust Perceptive Locomotion video.",
        ["legged-locomotion-demo"],
      ),
      learn(
        "eth-perception-training",
        "Training and unreliable perception",
        [sources.locomotion],
        "Inspect the training diagram and unreliable-perception examples. Identify proprioceptive/exteroceptive inputs and how perception failures affect the policy.",
      ),
    ],
  },
  {
    id: "agile-platforms",
    title: "Agile flight and humanoid locomotion",
    shortTitle: "Agile platforms",
    topicGroupId: "drones-legged",
    sections: [
      learn(
        "agile-flight-method",
        "Learning high-speed flight",
        [sources.agileFlight],
        "Watch the main video and read the method overview: onboard perception, learned trajectories, privileged training, and receding-horizon execution.",
      ),
      learn(
        "humanoid-teacher-student",
        "Humanoid teacher-to-student training",
        [sources.rpl],
        "Watch the main RPL video and inspect its teacher-to-student training diagram. Distinguish privileged experts from the depth-based student.",
      ),
      practice(
        "platform-comparison",
        "Compare robot platforms",
        [],
        "Compare a rover, arm, drone, and walking robot using one line each: sensing, action, stability/contact, and a failure mode. Pick one shared issue involving latency or estimation.",
        undefined,
        25,
      ),
    ],
  },
  {
    id: "vla-predictive-models",
    title: "Vision-language-action and predictive models",
    shortTitle: "VLAs & world models",
    topicGroupId: "physical-ai",
    sections: [
      learn(
        "vla-architecture",
        "From language and vision to actions",
        [sources.vla],
        "Watch the introduction, LLM → VLM → VLA progression, and Architecture chapters.",
      ),
      learn(
        "vla-training-workflow",
        "VLA training and fine-tuning preparation",
        [sources.vla],
        "Watch Training, Fine-tuning Preparation, and the closing discussion. Treat this as explanation, not a required full training run.",
      ),
      learn(
        "smolvla-architecture-workflow",
        "SmolVLA architecture and workflow",
        [sources.smolvla],
        "Read the architecture and workflow explanation: image/state/language inputs, action prediction, and execution. Do not undertake full fine-tuning.",
      ),
      learn(
        "model-based-learning",
        "Model-based reinforcement learning",
        [sources.modelBased],
        "Watch Why Choose Model-Based Reinforcement Learning?",
        ["model-based-rl"],
      ),
      learn(
        "world-foundation-models-section",
        "World foundation models",
        [sources.worldModels],
        "Watch World Foundation Models. Distinguish a learned predictive model from a physics simulator and a feedback controller.",
      ),
    ],
  },
  {
    id: "physical-ai-directions",
    title: "Physical AI workflows and next directions",
    shortTitle: "Physical AI workflow",
    topicGroupId: "physical-ai",
    sections: [
      learn(
        "physical-ai-introduction",
        "Physical AI workflow introduction",
        [sources.physicalIntro],
        "Watch the Learning Physical AI introduction.",
      ),
      learn(
        "physical-ai-overview",
        "An end-to-end Physical AI workflow",
        [sources.physicalOverview],
        "Read the overview only: demonstration data, simulation, model training, and deployment. The full curriculum, Isaac setup, and hardware are optional later projects.",
      ),
      practice(
        "choose-learning-directions",
        "Choose two small next projects",
        [],
        "Choose a primary direction and a second direction. For each, name one small project, its observation/action loop, and a concrete success check.",
        undefined,
        20,
      ),
    ],
  },
];

export const coreSections = roadmap.flatMap((stage, stageIndex) =>
  stage.sections.map((section, sectionIndex) => ({
    stage,
    section,
    stageNumber: stageIndex + 1,
    sectionNumber: sectionIndex + 1,
  })),
);

const optionalLegacyResourceIds = new Set([
  "ros-overview",
  "begin-robotics",
  "robot-dog-build",
  "opendog-walk",
  "balancing-bike",
  "robots-see",
  "meet-ethan",
  "mars-helicopter",
  "stretch-dhl",
  "agri-robotics",
  "atlas-learning",
  "physical-ai-intro",
  "gemini-robotics",
  "world-models",
  "jim-fan-challenge",
  "meet-tom",
  "better-robots",
]);

export const optionalResources: LearningResource[] = [
  ...legacyCurriculum
    .flatMap((stage) => stage.resources)
    .filter((item) => optionalLegacyResourceIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      creator: item.creator,
      url: item.url,
      label: item.label,
      scope: item.selection,
    })),
  {
    ...sources.fusion,
    id: "optional-fusion-pose",
    scope: "Part 3: Fusing a GPS and IMU to Estimate Pose.",
  },
];
