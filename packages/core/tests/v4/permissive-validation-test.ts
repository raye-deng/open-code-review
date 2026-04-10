/**
 * Permissive Input Validation Tests
 *
 * Tests for detecting overly permissive input validation patterns
 * that AI commonly generates instead of meaningful constraints.
 *
 * @since 0.5.0
 */

import { describe, it, expect } from 'vitest';
import { SecurityPatternDetector } from '../../src/detectors/v4/security-pattern.js';
import type { DetectorContext } from '../../src/detectors/v4/types.js';
import type { CodeUnit } from '../../src/ir/types.js';
import { createCodeUnit } from '../../src/ir/types.js';

// ─── Helpers ───────────────────────────────────────────────────────

function makeUnit(
  source: string,
  language: CodeUnit['language'] = 'typescript',
  file: string = 'test.ts',
): CodeUnit {
  return createCodeUnit({
    id: `func:${file}:fn`,
    file,
    language,
    kind: 'function',
    location: { startLine: 0, startColumn: 0, endLine: source.split('\n').length, endColumn: 0 },
    source,
  });
}

function createContext(): DetectorContext {
  return {
    projectRoot: '/project',
    allFiles: ['test.ts'],
  };
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('Permissive Input Validation Detection', () => {
  const detector = new SecurityPatternDetector();

  describe('Zod Schema Validation', () => {
    it('should detect z.string().min(1) permissive pattern', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.string().min(1);
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
    });

    it('should detect z.number().min(1) permissive pattern', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.number().min(1);
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
    });

    it('should detect z.boolean().optional() permissive pattern', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.boolean().optional();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
    });

    it('should detect z.any() permissive pattern', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.any();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
    });

    it('should detect z.unknown() permissive pattern', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.unknown();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
    });

    it('should not flag proper Zod validation with meaningful constraints', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.string().min(3).max(50).email();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(false);
    });
  });

  describe('Joi Schema Validation', () => {
    it('should detect Joi.string().min(1) permissive pattern', async () => {
      const unit = makeUnit(`
        import Joi from 'joi';
        const schema = Joi.string().min(1);
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-joi-min-only')).toBe(true);
    });

    it('should detect Joi.number().min(1) permissive pattern', async () => {
      const unit = makeUnit(`
        import Joi from 'joi';
        const schema = Joi.number().min(1);
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-joi-min-only')).toBe(true);
    });

    it('should detect Joi.any() permissive pattern', async () => {
      const unit = makeUnit(`
        import Joi from 'joi';
        const schema = Joi.any();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-joi-min-only')).toBe(true);
    });

    it('should detect Joi.optional() permissive pattern', async () => {
      const unit = makeUnit(`
        import Joi from 'joi';
        const schema = Joi.string().optional();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-joi-min-only')).toBe(true);
    });

    it('should not flag proper Joi validation with meaningful constraints', async () => {
      const unit = makeUnit(`
        import Joi from 'joi';
        const schema = Joi.string().min(3).max(50).email();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-joi-min-only')).toBe(false);
    });
  });

  describe('Yup Schema Validation', () => {
    it('should detect yup.string().min(1) permissive pattern', async () => {
      const unit = makeUnit(`
        import * as yup from 'yup';
        const schema = yup.string().min(1);
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-yup-min-only')).toBe(true);
    });

    it('should detect yup.number().min(1) permissive pattern', async () => {
      const unit = makeUnit(`
        import * as yup from 'yup';
        const schema = yup.number().min(1);
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-yup-min-only')).toBe(true);
    });

    it('should detect yup.any() permissive pattern', async () => {
      const unit = makeUnit(`
        import * as yup from 'yup';
        const schema = yup.any();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-yup-min-only')).toBe(true);
    });

    it('should not flag proper Yup validation with meaningful constraints', async () => {
      const unit = makeUnit(`
        import * as yup from 'yup';
        const schema = yup.string().min(3).max(50).email();
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-yup-min-only')).toBe(false);
    });
  });

  describe('Direct Request Parameter Usage (No Validation)', () => {
    it('should detect req.body used directly without validation', async () => {
      const unit = makeUnit(`
        app.post('/api/user', (req, res) => {
          const username = req.body.username;
          const password = req.body.password;
          // ... process user input
        });
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-no-check')).toBe(true);
    });

    it('should detect req.params used directly without validation', async () => {
      const unit = makeUnit(`
        app.get('/api/user/:id', (req, res) => {
          const userId = req.params.id;
          // ... use userId directly
        });
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-no-check')).toBe(true);
    });

    it('should detect req.query used directly without validation', async () => {
      const unit = makeUnit(`
        app.get('/api/search', (req, res) => {
          const searchTerm = req.query.q;
          // ... search without validation
        });
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-no-check')).toBe(true);
    });

    it('should not flag when validation is present', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        const schema = z.object({
          username: z.string().min(3).max(20),
        });

        app.post('/api/user', (req, res) => {
          const result = schema.validate(req.body);
          const username = result.data.username;
        });
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-no-check')).toBe(false);
    });
  });

  describe('Python Direct Request Parameter Usage (No Validation)', () => {
    it('should detect request.json used directly without validation', async () => {
      const unit = makeUnit(`
        @app.route('/api/user', methods=['POST'])
        def create_user():
            data = request.json
            username = data['username']
            password = data['password']
            # ... process user input
      `, 'python');

      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-python-no-check')).toBe(true);
    });

    it('should detect request.args used directly without validation', async () => {
      const unit = makeUnit(`
        @app.route('/api/search')
        def search():
            query = request.args['q']
            # ... search without validation
      `, 'python');

      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-python-no-check')).toBe(true);
    });

    it('should not flag when validation is present (Pydantic)', async () => {
      const unit = makeUnit(`
        from pydantic import BaseModel
        from fastapi import FastAPI

        app = FastAPI()

        class UserCreate(BaseModel):
            username: str
            password: str

        @app.post('/api/user')
        def create_user(user: UserCreate):
            return user
      `, 'python');

      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-python-no-check')).toBe(false);
    });
  });

  describe('Real-world AI-generated code examples', () => {
    it('should flag common AI-generated Express + Zod anti-pattern', async () => {
      const unit = makeUnit(`
        import express from 'express';
        import { z } from 'zod';

        const app = express();

        // AI generated: overly permissive validation
        const userSchema = z.object({
          username: z.string().min(1),
          email: z.string().min(1),
          age: z.number().min(1),
        });

        app.post('/api/user', (req, res) => {
          const user = userSchema.parse(req.body);
          // user.email is just checked for non-empty, not valid email format
        });
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
    });

    it('should flag common AI-generated FastAPI without Pydantic', async () => {
      const unit = makeUnit(`
        from flask import Flask, request

        app = Flask(__name__)

        # AI generated: no validation at all
        @app.route('/api/user', methods=['POST'])
        def create_user():
            data = request.json
            username = data.get('username')
            email = data.get('email')
            # directly use user input
            return {'username': username}
      `, 'python');

      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-python-no-check')).toBe(true);
    });

    it('should flag multiple permissive validation patterns in one file', async () => {
      const unit = makeUnit(`
        import { z } from 'zod';
        import Joi from 'joi';

        const zodSchema = z.string().min(1);
        const joiSchema = Joi.string().min(1);

        app.post('/api/test', (req, res) => {
          const data = req.body.input;
          res.json({ data });
        });
      `);
      const results = await detector.detect([unit], createContext());

      expect(results.some(r => r.metadata.patternId === 'permissive-validation-zod-min-only')).toBe(true);
      expect(results.some(r => r.metadata.patternId === 'permissive-validation-joi-min-only')).toBe(true);
      expect(results.some(r => r.metadata.patternId === 'permissive-validation-no-check')).toBe(true);
    });
  });
});
