'use strict';

const { response, dynamo, mozcast } = require('@fxlisten/core');
const util = require('util');
const rp = require('request-promise');
const _ = require('lodash');
const { User } = dynamo;

module.exports.handler = async (event, context) => {
  let userId = event.requestContext.authorizer.principalId;
  let items;
  items = await list(userId);
  return response.success(items);
};

const list = async userId => {
  const user = await User.get(userId);
  const topics = await getCategories(user.topics);
  const options = {
    url: process.env.LISTEN_SERVER + '/command/trending',
    method: 'POST',
    body: JSON.stringify({
      topic: _.map(topics, 'name'),
      count: 5
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': process.env.LISTEN_JWT
    }
  };
  const articles = JSON.parse(await rp(options));
  const episodes = await getEpisodes(user.podcasts);
  const articlesArray = articles.map(article => {
    return {
      id: article.id,
      title: article.title,
      imageUrl: article.image_url,
      url: article.url,
      type: 'article',
      logo: article.logo,
      duration: article.duration,
      publisher: article.domain_name
    };
  });
  const episodesArray = episodes.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      imageUrl: episode.image,
      audioUrl: episode.audioUrl,
      type: 'episode',
      publisher: episode.publisher,
      duration: Math.round(episode.duration/60)
    };
  });
  if (articlesArray.length && episodesArray.length) {
    return articlesArray.concat(episodesArray);
  } else if (articlesArray.length && !episodesArray.length) {
    return articlesArray;
  } else if (!articlesArray.length && episodesArray.length) {
    return episodesArray;
  } else {
    return [];
  }
};

const getCategories = async topics => {
  const GET_CATEGORIES = `
    query($ids: [ID]) {
      categories(ids: $ids) {
        id
        name
      }
    }
  `;
  const ids = topics ? topics.split(',') : [];
  const { categories } = ids.length
    ? await mozcast.graphql(GET_CATEGORIES, { ids: ids })
    : { categories: ids };
  return categories;
};

const getEpisodes = async podcasts => {
  const GET_EPISODES = `
    query($podcastIds: [ID], $count: Int) {
      episodes(podcastIds: $podcastIds, count: $count) {
        id
        title
        description
        audioUrl
        image
        publisher
        duration
      }
    }
  `;
  const podcastIds = podcasts ? podcasts.split(',') : [];
  const { episodes } = podcastIds.length
    ? await mozcast.graphql(GET_EPISODES, { podcastIds: podcastIds, count: 5 })
    : { episodes: podcastIds };
  return episodes;
};
