#!/usr/bin/env node
'use strict';

const path = require('path');
const express = require('express');
const { buildPlan } = require('./planContent');
const { buildDocument } = require('./buildDocx');
const { buildPrd } = require('./prdContent');
const { buildPrdDocument } = require('./buildPrdDocx');
const { Packer } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/generate', async (req, res) => {
  const body = req.body || {};

  if (!body.baName || !body.topic || !body.mentor) {
    res.status(400).json({ error: 'Name, topic, and mentor are required.' });
    return;
  }

  const options = {
    baName: body.baName,
    role: body.role || 'new_ba',
    topic: body.topic,
    productName: body.productName || undefined,
    subProcessTopic: body.subProcessTopic || undefined,
    mentor: body.mentor,
    durationMonths: Number(body.durationMonths) || 3,
    evaluationFrequency: body.evaluationFrequency || undefined,
    startDate: body.startDate || undefined,
    prdTemplateName: body.prdTemplateName || undefined,
    prdTemplateLink: body.prdTemplateLink || undefined,
  };
  Object.keys(options).forEach((k) => options[k] === undefined && delete options[k]);

  try {
    const plan = buildPlan(options);
    const doc = buildDocument(plan);
    const buffer = await Packer.toBuffer(doc);
    const safeName = options.baName.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
    const filename = `${safeName || 'BA'}_Onboarding_Plan.docx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/generate-prd', async (req, res) => {
  const body = req.body || {};

  if (!body.productName || !body.featureName || !body.author) {
    res.status(400).json({ error: 'Product name, feature name, and author are required.' });
    return;
  }

  const options = {
    productName: body.productName,
    featureName: body.featureName,
    author: body.author,
    businessUnit: body.businessUnit || undefined,
    documentVersion: body.documentVersion || undefined,
    status: body.status || undefined,
    priority: body.priority || undefined,
    targetRelease: body.targetRelease || undefined,
    businessNeed: body.businessNeed || undefined,
    currentState: body.currentState || undefined,
    futureState: body.futureState || undefined,
  };
  Object.keys(options).forEach((k) => options[k] === undefined && delete options[k]);

  try {
    const prd = buildPrd(options);
    const doc = buildPrdDocument(prd);
    const buffer = await Packer.toBuffer(doc);
    const safeName = options.featureName.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
    const filename = `${safeName || 'Banking'}_PRD.docx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`BA Onboarding Plan Generator running at http://localhost:${PORT}`);
});
