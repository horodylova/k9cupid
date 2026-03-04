export function getResultAnalysis(answers: { id: string; value: unknown }[]) {
  const getAnswer = (id: string) => {
    const ans = answers.find((a) => a.id === id);
    return ans ? ans.value : undefined;
  };

  const purposeVal = getAnswer("purpose") as string | undefined;
  const activityVal = getAnswer("activity_level") as string | undefined;
  const workVal = getAnswer("work_schedule") as string | undefined;

  let title = "Your Perfect Match";
  let purposeText = "a companion";
  
  // 1. Determine Title and Purpose Text
  switch (purposeVal) {
    case "purpose_guard":
      title = "Your Loyal Guardian";
      purposeText = "a protector for your home";
      break;
    case "purpose_active":
      title = "Your Active Partner";
      purposeText = "an energetic partner for your adventures";
      break;
    case "purpose_companion":
      title = "Your Family Companion";
      purposeText = "a loving family member";
      break;
    case "purpose_service":
      title = "Your Service Partner";
      purposeText = "a reliable working partner";
      break;
    case "purpose_support":
      title = "Your Comfort Companion";
      purposeText = "an emotional support companion";
      break;
    case "purpose_friend":
      title = "Your Best Friend";
      purposeText = "a loyal best friend";
      break;
    default:
      title = "Your Future Dog";
      purposeText = "a faithful companion";
  }

  // 2. Determine Activity Text
  let activityText = "";
  switch (activityVal) {
    case "activity_sports":
      activityText = "can keep up with your high-energy lifestyle and sports";
      break;
    case "activity_regular":
      activityText = "enjoys regular active walks and weekend adventures";
      break;
    case "activity_calm_walks":
      activityText = "enjoys calm walks and quality time at home";
      break;
    case "activity_couch":
      activityText = "is happy to relax and cuddle on the couch";
      break;
    default:
      activityText = "matches your lifestyle";
  }

  // 3. Combine Text
  const text = `You are looking for ${purposeText} who ${activityText}.`;

  // 4. Add Work Schedule Note (Optional, if relevant)
  let workText = "";
  if (workVal === "work_full_time") {
    workText = " We also considered your work schedule to find independent breeds.";
  }

  return {
    title,
    text: text + workText
  };
}
