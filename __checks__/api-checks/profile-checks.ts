import { ApiCheck, AssertionBuilder, type CheckGroupV2 } from 'checkly/constructs';

type Profile = {
  id: number;
  name: string;
  profile_url: string;
};

export function createProfileChecks(profiles: readonly Profile[], group: CheckGroupV2, idPrefix = 'profile') {
  const seen = new Set<number>();

  return profiles.map(({ id, name, profile_url }) => {
    if (seen.has(id)) {
      throw new Error(`Duplicate user id ${id} for prefix "${idPrefix}"; each check needs a unique id`);
    }
    seen.add(id);

    return new ApiCheck(`${idPrefix}-${id}`, {
      name: `Profile API · ${name}`,
      group,
      request: {
        method: 'GET',
        url: profile_url,
        headers: [{ key: 'Authorization', value: 'Bearer {{PROFILE_API_TOKEN}}' }],
        assertions: [
          AssertionBuilder.statusCode().equals(200),
          AssertionBuilder.jsonBody('$.id').equals(id),
          AssertionBuilder.jsonBody('$.name').equals(name),
        ],
      },
    });
  });
}
