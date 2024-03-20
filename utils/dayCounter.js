function daysSince(dateString) {
  // Parse the input date
  const inputDate = new Date(dateString);

  // Get today's date (with time cleared to midnight for accurate comparison)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const diffInMs = today - inputDate;

  // Convert milliseconds to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Return the integer part of the days difference
  return Math.floor(diffInDays);
}
  
  
module.exports = daysSince