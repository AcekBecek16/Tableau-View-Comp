# Tableau Dashboard Integration for Salesforce

A Lightning Web Component (LWC) that seamlessly integrates Tableau dashboards into Salesforce, providing users with powerful data visualization capabilities directly within their Salesforce environment.

## Features

✨ **Dynamic Dashboard Selection**: Dropdown interface to select from configured Tableau dashboards
📊 **Embedded Tableau Views**: Full Tableau dashboard functionality within Lightning cards
🔄 **Real-time Refresh**: Built-in refresh functionality to update dashboard data
📱 **Responsive Design**: Optimized for both desktop and mobile Salesforce experiences
🎛️ **Configurable Dimensions**: Customizable height and width for different use cases
🏗️ **Metadata-Driven**: Dashboard URLs managed through custom metadata for easy configuration
⚡ **Lightning Fast**: Optimized loading with proper error handling and user feedback

## Architecture

### Components
- **tableauViewComp**: Main Lightning Web Component for dashboard display
- **Dashboard_List__mdt**: Custom Metadata Type for managing dashboard configurations
- **tableaujs**: Static resource containing Tableau JavaScript API

### Key Technologies
- Lightning Web Components (LWC)
- Tableau JavaScript API v2
- GraphQL for metadata queries
- Custom Metadata Types for configuration management
- Salesforce Lightning Design System (SLDS)

## Installation & Setup

### Prerequisites
- Salesforce org with Lightning Experience enabled
- Tableau Server/Online with accessible dashboard URLs
- Appropriate permissions to deploy Lightning components

### Deployment Steps

1. **Deploy to Salesforce**:
   ```bash
   sf project deploy start --source-dir force-app/main/default
   ```

2. **Configure Dashboard Metadata**:
   - Navigate to Setup → Custom Metadata Types → Dashboard List
   - Create new records with:
     - Label: Display name for the dashboard
     - URL: Complete Tableau dashboard URL

3. **Add to Lightning Pages**:
   - Use Lightning App Builder to add the component to record pages, app pages, or home pages
   - Configure component properties as needed

## Usage

1. **Dashboard Selection**: Use the dropdown to select from available Tableau dashboards
2. **View Dashboard**: The selected dashboard loads automatically in the component
3. **Refresh Data**: Click the refresh button to update dashboard data
4. **Interactive Features**: All standard Tableau interactions (filters, drill-downs, etc.) are supported

## Configuration

### Component Properties
- `height`: Dashboard container height (default: 600px)
- `width`: Dashboard container width (default: 100%)

### Custom Metadata Setup
Create Dashboard_List__mdt records with:
- **Label**: User-friendly dashboard name
- **URL__c**: Full Tableau dashboard URL (including server and workbook path)

## Development

### Local Development Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Code formatting
npm run prettier

# Linting
npm run lint
```

### Testing
- Unit tests included using @salesforce/sfdx-lwc-jest
- Run tests with `npm run test:unit` or `sf lightning lwc test run`
- Coverage reports available with `npm run test:unit:coverage`
- Watch mode: `sf lightning lwc test run --watch`

## Technical Implementation

### Error Handling
- Comprehensive error handling for Tableau API loading failures
- User-friendly toast notifications for errors
- Graceful fallback when dashboards are unavailable

### Performance Optimizations
- Lazy loading of Tableau JavaScript API
- Efficient component lifecycle management
- Proper disposal of Tableau viz objects

### Security Considerations
- CORS configuration required for Tableau server
- Proper authentication handling for Tableau dashboards
- Secure metadata-driven configuration

## Troubleshooting

### Common Issues
1. **Dashboard not loading**: Check CORS settings on Tableau server
2. **Empty dropdown**: Verify Dashboard_List__mdt records are created
3. **Authentication errors**: Ensure proper Tableau permissions

### Debug Mode
Enable debug logging in the browser console to troubleshoot loading issues.

## Contributing

When contributing to this project:
1. Follow Salesforce DX development practices
2. Maintain test coverage above 75%
3. Use Prettier for code formatting
4. Follow Lightning Web Components best practices

## Salesforce CLI Commands

### Development Workflow
```bash
# Create scratch org
sf org create scratch --definition-file config/project-scratch-def.json --alias tableau-dev

# Deploy source
sf project deploy start --source-dir force-app/main/default

# Push source to scratch org
sf project deploy start

# Pull changes from scratch org
sf project retrieve start

# Open scratch org
sf org open

# Run tests
sf lightning lwc test run

# Generate package
sf package create --name "Tableau Integration" --package-type Unlocked
```

### Data Management
```bash
# Export custom metadata
sf data export tree --query "SELECT Label, URL__c FROM Dashboard_List__mdt" --output-dir data

# Import custom metadata
sf data import tree --files data/Dashboard_List__mdt.json
```

## Resources

- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Lightning Web Components Documentation](https://developer.salesforce.com/docs/component-library/overview/components)
- [Tableau JavaScript API Documentation](https://help.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api.htm)
- [Custom Metadata Types Guide](https://developer.salesforce.com/docs/atlas.en-us.custommetadatatypes.meta/custommetadatatypes/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
