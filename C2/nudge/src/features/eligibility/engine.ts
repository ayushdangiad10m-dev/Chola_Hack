import { StudentProfile, Opportunity, EligibilityResult, StructuredEligibilityRule } from "@/types";

export function evaluateEligibility(
  profile: StudentProfile | null | undefined,
  opportunity: Opportunity
): EligibilityResult {
  if (!profile) {
    return {
      opportunity_id: opportunity.id,
      verdict: "needs_info",
      score: 50,
      reasons: ["Sign in or complete profile to verify full eligibility."],
      missing_information: ["Complete student profile"],
      disqualifying_reasons: [],
    };
  }

  const reasons: string[] = [];
  const missing_information: string[] = [];
  const disqualifying_reasons: string[] = [];

  let totalRules = 0;
  let passedRules = 0;

  for (const rule of opportunity.eligibility_rules) {
    totalRules++;
    const status = checkRule(profile, rule);

    if (status.status === "passed") {
      passedRules++;
      reasons.push(status.message);
    } else if (status.status === "missing_info") {
      missing_information.push(status.message);
    } else if (status.status === "failed") {
      if (rule.mandatory) {
        disqualifying_reasons.push(status.message);
      } else {
        missing_information.push(status.message);
      }
    }
  }

  // Also check skills overlap
  if (opportunity.required_skills && opportunity.required_skills.length > 0) {
    const studentSkills = new Set(profile.skills.map((s) => s.toLowerCase()));
    const matchingSkills = opportunity.required_skills.filter((s) =>
      studentSkills.has(s.toLowerCase())
    );
    const skillMatchRate = matchingSkills.length / opportunity.required_skills.length;

    if (matchingSkills.length > 0) {
      reasons.push(
        `Matches ${matchingSkills.length} of ${opportunity.required_skills.length} skills (${matchingSkills.join(
          ", "
        )})`
      );
    } else {
      missing_information.push(
        `Required skills missing: ${opportunity.required_skills.slice(0, 3).join(", ")}`
      );
    }
  }

  let verdict: EligibilityResult["verdict"] = "eligible";
  if (disqualifying_reasons.length > 0) {
    verdict = "not_eligible";
  } else if (missing_information.length > 1 && passedRules === 0) {
    verdict = "unsure";
  } else if (missing_information.length > 0) {
    verdict = "needs_info";
  }

  const score = totalRules > 0
    ? Math.round((passedRules / Math.max(totalRules, 1)) * 100)
    : 85;

  return {
    opportunity_id: opportunity.id,
    verdict,
    score: disqualifying_reasons.length > 0 ? Math.min(score, 30) : score,
    reasons,
    missing_information,
    disqualifying_reasons,
  };
}

function checkRule(
  profile: StudentProfile,
  rule: StructuredEligibilityRule
): { status: "passed" | "failed" | "missing_info"; message: string } {
  switch (rule.field) {
    case "current_year": {
      if (!profile.current_year) {
        return { status: "missing_info", message: `Year of study not specified in your profile (Requires Year ${rule.value})` };
      }
      if (rule.operator === "in" && Array.isArray(rule.value)) {
        const matches = rule.value.includes(profile.current_year);
        return matches
          ? { status: "passed", message: `Current academic year (${profile.current_year}) matches requirements.` }
          : { status: "failed", message: `Requires year ${rule.value.join(" or ")}, but you are in Year ${profile.current_year}.` };
      }
      if (rule.operator === "gte") {
        return profile.current_year >= rule.value
          ? { status: "passed", message: `Academic year ${profile.current_year} satisfies minimum Year ${rule.value}.` }
          : { status: "failed", message: `Requires at least Year ${rule.value}, current is Year ${profile.current_year}.` };
      }
      break;
    }

    case "cgpa": {
      if (profile.cgpa === undefined || profile.cgpa === null) {
        return { status: "missing_info", message: `Add your CGPA to verify requirement (Minimum ${rule.value})` };
      }
      return profile.cgpa >= rule.value
        ? { status: "passed", message: `CGPA ${profile.cgpa} satisfies minimum requirement of ${rule.value}.` }
        : { status: "failed", message: `CGPA ${profile.cgpa} is below requirement of ${rule.value}.` };
    }

    case "degree": {
      if (!profile.degree) {
        return { status: "missing_info", message: `Degree not specified in profile (Requires ${rule.value})` };
      }
      const deg = profile.degree.toLowerCase();
      if (rule.operator === "in" && Array.isArray(rule.value)) {
        const matches = rule.value.some((d: string) => deg.includes(d.toLowerCase()));
        return matches
          ? { status: "passed", message: `Degree (${profile.degree}) meets program criteria.` }
          : { status: "failed", message: `Requires degree in ${rule.value.join(", ")}, current is ${profile.degree}.` };
      }
      break;
    }

    case "work_mode": {
      if (!profile.preferred_work_modes || profile.preferred_work_modes.length === 0) {
        return { status: "passed", message: `Opportunity is ${rule.value}.` };
      }
      return profile.preferred_work_modes.includes(rule.value)
        ? { status: "passed", message: `Matches your work mode preference (${rule.value}).` }
        : { status: "missing_info", message: `Opportunity is ${rule.value}, but you prefer ${profile.preferred_work_modes.join("/")}.` };
    }
  }

  return { status: "passed", message: rule.label };
}
