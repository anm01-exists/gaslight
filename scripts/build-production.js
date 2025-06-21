#!/usr/bin/env node

/**
 * Production Build Script for StudyHub
 * This script handles the complete production build process with optimizations
 */

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

class ProductionBuilder {
  constructor() {
    this.startTime = Date.now();
    this.buildDir = "dist";
  }

  async run() {
    console.log("🚀 Starting StudyHub production build...\n");

    try {
      await this.preBuildChecks();
      await this.cleanBuildDirectory();
      await this.runTypeCheck();
      await this.buildProject();
      await this.postBuildOptimizations();
      await this.generateBuildReport();

      this.logSuccess();
    } catch (error) {
      this.logError(error);
      process.exit(1);
    }
  }

  async preBuildChecks() {
    console.log("📋 Running pre-build checks...");

    // Check if all required environment variables are set
    const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`,
      );
    }

    // Check package.json
    try {
      await fs.access("package.json");
      console.log("✅ package.json found");
    } catch {
      throw new Error("package.json not found");
    }

    // Check if node_modules exists
    try {
      await fs.access("node_modules");
      console.log("✅ node_modules found");
    } catch {
      console.log("📦 Installing dependencies...");
      await execAsync("npm ci");
    }

    console.log("✅ Pre-build checks passed\n");
  }

  async cleanBuildDirectory() {
    console.log("🧹 Cleaning build directory...");

    try {
      await fs.rm(this.buildDir, { recursive: true, force: true });
      console.log("✅ Build directory cleaned\n");
    } catch (error) {
      console.log("⚠️  Build directory already clean\n");
    }
  }

  async runTypeCheck() {
    console.log("🔍 Running TypeScript type check...");

    try {
      const { stdout, stderr } = await execAsync("npm run typecheck");
      if (stderr && !stderr.includes("0 errors")) {
        throw new Error(`TypeScript errors found:\n${stderr}`);
      }
      console.log("✅ TypeScript check passed\n");
    } catch (error) {
      throw new Error(`TypeScript check failed: ${error.message}`);
    }
  }

  async buildProject() {
    console.log("🔨 Building project...");

    try {
      const { stdout, stderr } = await execAsync("npm run build");

      if (stderr && stderr.includes("error")) {
        throw new Error(`Build failed:\n${stderr}`);
      }

      console.log("��� Project built successfully\n");
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async postBuildOptimizations() {
    console.log("⚡ Running post-build optimizations...");

    // Ensure critical files exist
    const criticalFiles = [
      "index.html",
      "manifest.json",
      "robots.txt",
      "sitemap.xml",
    ];

    for (const file of criticalFiles) {
      try {
        await fs.access(path.join(this.buildDir, file));
        console.log(`✅ ${file} found`);
      } catch {
        console.log(`⚠️  ${file} missing - consider adding it`);
      }
    }

    // Check bundle sizes
    await this.checkBundleSizes();

    console.log("✅ Post-build optimizations completed\n");
  }

  async checkBundleSizes() {
    console.log("📊 Analyzing bundle sizes...");

    try {
      const assetsDir = path.join(this.buildDir, "assets");
      const files = await fs.readdir(assetsDir);

      const jsFiles = files.filter((file) => file.endsWith(".js"));
      const cssFiles = files.filter((file) => file.endsWith(".css"));

      let totalSize = 0;
      const fileSizes = [];

      for (const file of [...jsFiles, ...cssFiles]) {
        const filePath = path.join(assetsDir, file);
        const stats = await fs.stat(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        fileSizes.push({ file, size: sizeKB });
      }

      // Sort by size
      fileSizes.sort((a, b) => b.size - a.size);

      console.log("\n📦 Bundle Analysis:");
      fileSizes.forEach(({ file, size }) => {
        const type = file.endsWith(".js") ? "JS" : "CSS";
        const warning = size > 500 ? " ⚠️" : size > 100 ? " ⚡" : " ✅";
        console.log(`  ${type}: ${file} - ${size}KB${warning}`);
      });

      console.log(`\n📊 Total bundle size: ${totalSize}KB`);

      if (totalSize > 2000) {
        console.log(
          "⚠️  Bundle size is large (>2MB). Consider code splitting.",
        );
      } else if (totalSize > 1000) {
        console.log("⚡ Bundle size is moderate (>1MB). Monitor for growth.");
      } else {
        console.log("✅ Bundle size is good (<1MB).");
      }
    } catch (error) {
      console.log("⚠️  Could not analyze bundle sizes");
    }
  }

  async generateBuildReport() {
    console.log("📝 Generating build report...");

    const buildTime = Date.now() - this.startTime;
    const report = {
      timestamp: new Date().toISOString(),
      buildTime: `${Math.round(buildTime / 1000)}s`,
      environment: process.env.NODE_ENV || "production",
      nodeVersion: process.version,
      success: true,
    };

    try {
      // Get package.json version
      const packageJson = JSON.parse(
        await fs.readFile("package.json", "utf-8"),
      );
      report.version = packageJson.version;

      // Get git commit if available
      try {
        const { stdout } = await execAsync("git rev-parse --short HEAD");
        report.gitCommit = stdout.trim();
      } catch {
        report.gitCommit = "unknown";
      }

      // Write build report
      await fs.writeFile(
        path.join(this.buildDir, "build-report.json"),
        JSON.stringify(report, null, 2),
      );

      console.log("✅ Build report generated\n");
    } catch (error) {
      console.log("⚠️  Could not generate build report");
    }
  }

  logSuccess() {
    const buildTime = Math.round((Date.now() - this.startTime) / 1000);

    console.log("🎉 Build completed successfully!");
    console.log(`⏱️  Total build time: ${buildTime}s`);
    console.log(`📁 Output directory: ${this.buildDir}/`);
    console.log("\n🚀 Your StudyHub app is ready for deployment!");
    console.log("\n📖 Next steps:");
    console.log("  1. Test the build: npm run preview");
    console.log("  2. Deploy to your hosting platform");
    console.log("  3. Update DNS and SSL certificates");
    console.log("  4. Monitor performance and errors");
  }

  logError(error) {
    console.error("\n❌ Build failed!");
    console.error("Error:", error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("  1. Check environment variables");
    console.error("  2. Run npm install to update dependencies");
    console.error("  3. Check TypeScript errors with npm run typecheck");
    console.error("  4. Review the full error message above");
  }
}

// Run the builder
const builder = new ProductionBuilder();
builder.run();
