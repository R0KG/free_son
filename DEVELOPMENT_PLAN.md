# Sonya Project: Development Plan & Recommendations

## 1. Project Overview

**Current State:** The project is a well-structured MVP for a cottage town development. It features a multi-step user flow to select a plot, construction format, and house model, culminating in a personal dashboard. The frontend is built with Next.js and React, utilizing a context for state management. The backend has API routes for price calculation and is configured for Google Sheets integration.

**Core Strengths:**

- **Modular Frontend:** A component-based architecture which is easy to maintain and extend.
- **Clear User Journey:** The step-by-step process is intuitive for new users.
- **Solid Backend Foundation:** The API for calculations and the Google Sheets client are great starting points.

## 2. High-Level Goals

Based on your request, the primary goals are:

1. **Enrich the Personal Dashboard:** Transform it from a static summary into an interactive "personal cabinet".
2. **Integrate the Calculator:** Allow users to calculate and adjust the cost of their specific project within their dashboard.
3. **Visualize Project Progress:** Add a progress bar to the dashboard to show the construction status.
4. **Solidify Data Integration:** Ensure seamless data flow between the app and Google Sheets.
5. **Enhance UI/UX:** Polish the design and add relevant, dynamic information.

## 3. Detailed Recommendations & Action Plan

Here is a phased roadmap to achieve these goals.

### Phase 1: Enhance the Personal Dashboard (Core User Value)

This phase focuses on the most critical request: making the dashboard a dynamic and personalized tool.

**1. Integrate the Project Calculator into the Dashboard:**

- **What:** Add the `CalculatorForm` component to the `PersonalDashboard`. This form should be pre-filled with data from the user's initial selection.
- **How:**
  - The `PersonalDashboard` currently shows a static summary. Modify it to include a new section for the calculator.
  - When the user changes options in the calculator (e.g., materials, finishes), call the `/api/calc` endpoint.
  - Update the "Total Cost" and other relevant parts of the dashboard in real-time with the response from the API.
- **Why:** This is the core of the "personalized cabinet". It gives users a powerful reason to return to their dashboard and engage with the project.

**2. Implement and Display Project Progress:**

- **What:** Add a visual progress bar to the `PersonalDashboard` that reflects the current stage of their project (e.g., "Planning", "Foundation", "Construction", "Finishing").
- **How:**
  - You already have a `ProjectProgress.tsx` component and a `lib/progress.ts` library.
  - The `computeProgress` function in `lib/progress.ts` should be used on the backend to determine the project's status based on stored data.
  - The project status should be saved as part of the project data.
  - Fetch this progress status on the dashboard page and pass it to the `ProjectProgress.tsx` component.
- **Why:** This adds significant value for the user post-purchase, keeping them informed and engaged throughout the construction lifecycle.

### Phase 2: Backend & Data Integrity

This phase ensures that the application is robust, scalable, and that data is handled correctly.

**1. Finalize Google Sheets Integration:**

- **What:** Ensure that all necessary data (user selections, calculator results, contact info) is being correctly and reliably sent to Google Sheets.
- **How:**
  - Securely add your Google Sheets credentials as environment variables (e.g., in a `.env.local` file).
  - The `/api/calc` route already appends calculation data. Consider adding another function to the `BookingStep` component to append lead/contact information to a separate sheet.
  - Add error handling to gracefully manage cases where Google Sheets is unavailable.
- **Why:** Google Sheets serves as a simple and effective CRM/database for this MVP, making it crucial for business operations.

**2. Refine Data Persistence:**

- **What:** Review the `lib/dataStorage.ts` functionality. Ensure that user selections and project data are being saved and retrieved efficiently.
- **How:** The current mechanism seems to work on a per-selection basis. For a true "personal cabinet", you might consider implementing user accounts in the future. For now, the unique URL per selection is a clever MVP approach.
- **Why:** A solid data layer is the foundation for all application features.

### Phase 3: User Experience & Polish

This phase focuses on improving the look, feel, and overall user experience.

**1. Enhance UI with Dynamic Content:**

- **What:** Replace static text and descriptions with dynamic data fetched from your backend or a content management system.
- **How:**
  - The details for houses, materials, and plot features can be fetched from an API route instead of being hardcoded in the frontend. This API could even read the data from a Google Sheet, making it easy for you to update.
  - Add more detailed descriptions and images for each house project and construction material in the calculator.
- **Why:** This makes the application feel more professional and makes it much easier to update your offerings without changing the code.

**2. General UI/UX Refinements:**

- **What:** Conduct a general review of the application to identify areas for UI improvement.
- **How:**
  - Ensure the design is fully responsive and looks great on all devices.
  - Add subtle animations and transitions to make the interface feel more alive.
  - Improve feedback to the user, for example by using toasts/notifications for actions like "Link Copied".
- **Why:** A polished UI builds user trust and makes the application more enjoyable to use.

## 4. Technical Recommendations

- **State Management:** You are currently using `SelectionContext`. This is excellent for the selection flow. For the personal dashboard, continue to fetch data directly via API calls to ensure the information is always up-to-date.
- **Authentication (Future):** While the current unique URL system is great for an MVP, the next logical step would be a simple authentication system (e.g., social login or email/password) to provide a more secure and persistent personal cabinet.
- **Environment Variables:** Make sure all sensitive information (API keys, Google Sheets credentials) is stored in environment variables and not committed to your git repository. Create a `.env.example` file to document the required variables.

## 5. Product Engineering Perspective

- **Prioritization:** The roadmap above is prioritized to deliver the highest user value first. Focus on **Phase 1** to meet the core request of an interactive personal cabinet.
- **MVP+:** Think of these changes as evolving your product from an MVP (Minimum Viable Product) to an "MVP+" or "Version 1.1". You are building upon a solid foundation rather than starting from scratch.
- **User Feedback:** After implementing Phase 1, try to get feedback from real users. Their insights will be invaluable for prioritizing future features. Do they understand the calculator? Do they find the progress bar useful?

By following this plan, you can systematically enhance your application, delivering significant new value to your users and turning your MVP into a more mature and engaging product.
