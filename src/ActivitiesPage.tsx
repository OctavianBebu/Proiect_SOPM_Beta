// ActivitiesPage.js
import React from 'react';

interface ActivitiesPageProps {
  activities: { [key: string]: { text: string; priority: number }[] };
}

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ activities }) => {
  return (
    <div>
      <h1>Activities</h1>
      {Object.keys(activities).map((dateKey) => (
        <div key={dateKey}>
          <h2>{new Date(dateKey).toDateString()}</h2>
          <ul>
            {activities[dateKey].map((activity, index) => (
              <li key={index}>
                {activity.text} - Priority: {activity.priority}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesPage;
