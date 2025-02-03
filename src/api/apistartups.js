import supabaseClient from "@/utils/supabase";

// Fetch Startups
export async function getStartups(token, { location, startup_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("startups")
    .select("*, saved: saved_startups(id), investor: investors(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (investor_id) {
    query = query.eq("investor_id", investor_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Startups:", error);
    return null;
  }

  return data;
}

// Read Saved Startups
export async function getSavedStartups(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_startups")
    .select("*, startup: startups(*, investor: investors(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Startups:", error);
    return null;
  }

  return data;
}

// Read single startup
export async function getSingleStartup(token, { startup_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("startups")
    .select(
      "*, company: investors(name,logo_url), applications: applications(*)"
    )
    .eq("id", startup_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Startup:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved Startup
export async function saveStartup(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the startup is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_startups")
      .delete()
      .eq("startup_id", saveData.startup_id);

    if (deleteError) {
      console.error("Error removing saved startup:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the startup is not saved, add it to saved startup
    const { data, error: insertError } = await supabase
      .from("saved_startups")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving startup:", insertError);
      return data;
    }

    return data;
  }
}

// - startup isOpen toggle - (investor_id = auth.uid())
export async function updateHiringStatus(token, { startup_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("startups")
    .update({ isOpen })
    .eq("id", startup_id)
    .select();

  if (error) {
    console.error("Error Updating Investing Status:", error);
    return null;
  }

  return data;
}

// get my created startups
export async function getMyStartups(token, { investor_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("startups")
    .select("*, investor: investors(name,logo_url)")
    .eq("investor_id", investor_id);

  if (error) {
    console.error("Error fetching Startups:", error);
    return null;
  }

  return data;
}

// Delete startup
export async function deleteStartup(token, { startup_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("startups")
    .delete()
    .eq("id", startup_id)
    .select();

  if (deleteError) {
    console.error("Error deleting startup:", deleteError);
    return data;
  }

  return data;
}

// - post startup
export async function addNewStartup(token, _, startupData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("startups")
    .insert([startupData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Startup");
  }

  return data;
}