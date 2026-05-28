# Rotary Inverted Pendulum
**Date:** [YYYY-MM]  
**Status:** [Completed / In Progress]  
**Topics:** Engineering, Control Systems, Robotics  
**Software:** [e.g., C++, Arduino IDE, MATLAB/Simulink]

## Project Overview
[Provide a high-level summary of the rotary inverted pendulum project. Explain the core goal: e.g., balancing a pendulum on a rotating arm using advanced control algorithms like LQR or PID, and how it differs from a linear cart pendulum.]

*[LAYOUT INSTRUCTION: Hero Section - Place the YouTube Highlight Video embed here spanning full width]*
- **Video Link:** [Insert YouTube Link Here]

## Hardware & Materials Stack
*[LAYOUT INSTRUCTION: Display as a clean bulleted list. CRITICAL: Follow the exact spacing and styling from `projects/engineering/inverted-pendulum/index.html` (e.g., `<h2 style="margin-bottom: 1rem;">` and `<ul style="margin-bottom: 4rem; list-style-position: inside; color: var(--text-main); line-height: 2;">`)]*
- **Microcontroller:** [e.g., Arduino, ESP32, Teensy]
- **Sensors:** [e.g., Rotary Encoders for the arm and the pendulum]
- **Actuators:** [e.g., DC Motor with Encoder, or Stepper Motor]
- **Motor Driver:** [e.g., L298N, BTS7960]
- **Power Supply:** [e.g., 12V Power Supply]
- **Chassis/Frame:** [e.g., Custom 3D printed base, slip rings]

## Development Rundown
*[LAYOUT INSTRUCTION: Vertical layout. Interleave text with full-width images to showcase the software and simulation heavily.]*

### Mechanical Design
[Describe the CAD process, the design of the rotating arm, and how the pendulum is attached. Discuss any challenges with friction or slip rings.]
**Media:**
- `![CAD Model of Base](images/cad_model.png)`

### Control Logic & Modeling
[Detail the control algorithm used. Since it's a rotary pendulum, explain if you used state-space modeling, LQR (Linear Quadratic Regulator), or a cascaded PID loop. Discuss how you derived the mathematical model.]
**Media:**
- `![Control Loop Diagram](images/control_diagram.png)`

### Tuning & Testing
[Discuss the process of tuning the controller gains and the challenges of getting the pendulum to swing up (if applicable) and balance consistently in the upright position.]
**Media:**
- `![Tuning Graph / Plot](images/tuning_plot.png)`

## Challenges & Future Roadmap
[Text detailing hurdles, such as sensor resolution limits, motor backlash, or the complexity of the math. Mention future plans like implementing a swing-up controller or using machine learning.]
